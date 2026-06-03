"use server";

import { toActionState } from "@/components/form/utils/to-action-state";
import getAuthOrRedirect from "@/features/auth/queries/get-auth-or-redirect";
import prisma from "@/lib/prisma";
import stripe from "@/lib/stripe/stripe";
import { pricingPath, signInPath, subscriptionPath } from "@/path";
import { Route } from "next";
import { redirect } from "next/navigation";

const createCheckoutSession = async (
  organizationId: string,
  priceId: string,
) => {
  if (!organizationId) redirect(signInPath());
  await getAuthOrRedirect();

  const stripeCustomer = await prisma.stripeCustomer.findUnique({
    where: {
      organizationId,
    },
  });

  if (!stripeCustomer)
    return toActionState("ERROR", "Stripe customer not found.");

  const price = await stripe.prices.retrieve(priceId);

  const session = await stripe.checkout.sessions.create({
    billing_address_collection: "auto",
    line_items: [
      {
        price: price.id,
        quantity: 1,
      },
    ],
    customer: stripeCustomer.customerId,
    mode: "subscription",
    success_url: `${process.env.BETTER_AUTH_URL}${subscriptionPath(organizationId)}`,
    cancel_url: `${process.env.BETTER_AUTH_URL}${pricingPath()}`,
    metadata: {
      organizationId,
    },
    subscription_data: {
      metadata: {
        organizationId,
      },
    },
  });

  if (!session.url)
    return toActionState("ERROR", "Session URL could not be created");

  redirect(session.url as Route);
};

export default createCheckoutSession;
