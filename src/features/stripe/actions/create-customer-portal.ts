"use server";

import { toActionState } from "@/components/form/utils/to-action-state";
import getAuthOrRedirect from "@/features/auth/queries/get-auth-or-redirect";
import prisma from "@/lib/prisma";
import stripe from "@/lib/stripe/stripe";
import { signInPath, subscriptionPath } from "@/path";
import { Route } from "next";
import { redirect } from "next/navigation";

const createCustomerPortal = async (organizationId: string) => {
  if (!organizationId) redirect(signInPath());
  await getAuthOrRedirect();

  const stripeCustomer = await prisma.stripeCustomer.findUnique({
    where: {
      organizationId,
    },
  });

  if (!stripeCustomer)
    return toActionState("ERROR", "Stripe customer not found.");

  const productsWithPrices = [];

  const products = await stripe.products.list({
    active: true,
  });

  for (const product of products.data) {
    const prices = await stripe.prices.list({
      active: true,
      product: product.id,
    });

    productsWithPrices.push({
      product,
      prices: prices.data,
    });
  }

  const configuration = await stripe.billingPortal.configurations.create({
    business_profile: {
      privacy_policy_url: "https://example.com/privacy",
      terms_of_service_url: "https://example.com/terms",
    },
    features: {
      payment_method_update: {
        enabled: true,
      },
      customer_update: {
        enabled: true,
        allowed_updates: ["email", "name", "address", "tax_id"],
      },
      invoice_history: {
        enabled: true,
      },
      subscription_cancel: {
        enabled: true,
        mode: "at_period_end",
      },
      subscription_update: {
        enabled: true,
        default_allowed_updates: ["price"],
        proration_behavior: "create_prorations",
        products: productsWithPrices.map(({ product, prices }) => ({
          product: product.id,
          prices: prices.map((price) => price.id),
        })),
      },
    },
  });

  const session = await stripe.billingPortal.sessions.create({
    customer: stripeCustomer.customerId,
    return_url: `${process.env.BETTER_AUTH_URL}${subscriptionPath(organizationId)}`,
    configuration: configuration.id,
  });

  if (!session.url)
    return toActionState("ERROR", "Session URL could not be created");

  redirect(session.url as Route);
};

export default createCustomerPortal;
