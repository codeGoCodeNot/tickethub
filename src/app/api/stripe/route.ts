import createActivityLog from "@/features/activity-logs/actions/create-activity-log";
import deprovisionOrganization from "@/features/stripe/actions/deprovision-organization";
import { ActivityAction } from "@/generated/prisma/enums";
import prisma from "@/lib/prisma";
import stripe from "@/lib/stripe/stripe";
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const handleSubscriptionCreated = async (subscription: Stripe.Subscription) => {
  const stripeCustomer = await prisma.stripeCustomer.update({
    where: {
      customerId: subscription.customer as string,
    },
    data: {
      subscriptionStatus: subscription.status,
      subscriptionId: subscription.id,
      priceId: subscription.items.data[0].price.id,
      productId: subscription.items.data[0].price.product as string,
    },
  });
  await createActivityLog({
    organizationId: stripeCustomer.organizationId,
    action: ActivityAction.subscription_created,
    metadata: {
      subscriptionId: subscription.id,
    },
  });
  revalidateTag(`activity-log-${stripeCustomer.organizationId}`, { expire: 0 });
};

const handleSubscriptionUpdated = async (subscription: Stripe.Subscription) => {
  const stripeCustomer = await prisma.stripeCustomer.update({
    where: {
      customerId: subscription.customer as string,
    },
    data: {
      subscriptionId: subscription.id,
      subscriptionStatus: subscription.status,
      priceId: subscription.items.data[0].price.id,
      productId: subscription.items.data[0].price.product as string,
    },
  });

  // if subscription is paused or cancelled, deprovision organization if they exceed team member limits
  const product = await stripe.products.retrieve(
    subscription.items.data[0].price.product as string,
  );

  // only deprovision on cancelled, paused subscriptions will be handled on stripe dashboard or by customer support, so we don't want to automatically deprovision on pause_incomplete or other non-final states
  const allowedTeamMembers = parseInt(product.metadata.allowedTeamMembers);
  await deprovisionOrganization(
    stripeCustomer.organizationId,
    allowedTeamMembers,
  );

  await createActivityLog({
    organizationId: stripeCustomer.organizationId,
    action: ActivityAction.subscription_updated,
    metadata: {
      subscriptionId: subscription.id,
    },
  });
  revalidateTag(`activity-log-${stripeCustomer.organizationId}`, { expire: 0 });
};

const handleSubscriptionDeleted = async (subscription: Stripe.Subscription) => {
  const stripeCustomer = await prisma.stripeCustomer.update({
    where: {
      customerId: subscription.customer as string,
    },
    data: {
      subscriptionId: null,
      subscriptionStatus: null,
      priceId: null,
      productId: null,
    },
  });

  // if subscription is deleted, deprovision organization immediately
  await deprovisionOrganization(stripeCustomer.organizationId, 1);
  await createActivityLog({
    organizationId: stripeCustomer.organizationId,
    action: ActivityAction.subscription_deleted,
    metadata: {
      subscriptionId: subscription.id,
    },
  });
  revalidateTag(`activity-log-${stripeCustomer.organizationId}`, { expire: 0 });
};

export const POST = async (request: NextRequest) => {
  const body = await request.text();
  const signature = (await headers()).get("Stripe-Signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret)
    return new Response("Webhook secret not configured", { status: 500 });

  if (!signature)
    return new Response("Missing Stripe-Signature header", { status: 400 });

  let event: Stripe.Event | null = null;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    switch (event.type) {
      case "customer.subscription.created":
        await handleSubscriptionCreated(
          event.data.object as Stripe.Subscription,
        );
        break;
      case "customer.subscription.updated":
        await handleSubscriptionUpdated(
          event.data.object as Stripe.Subscription,
        );
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(
          event.data.object as Stripe.Subscription,
        );
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new NextResponse("OK", { status: 200 });
  } catch {
    return new NextResponse("Invalid signature", { status: 400 });
  }
};
