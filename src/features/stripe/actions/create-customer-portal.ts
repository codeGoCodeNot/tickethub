"use server";

import { toActionState } from "@/components/form/utils/to-action-state";
import getAuthOrRedirect from "@/features/auth/queries/get-auth-or-redirect";
import prisma from "@/lib/prisma";
import stripe from "@/lib/stripe/stripe";
import { pricingPath, signInPath, subscriptionPath } from "@/path";
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

  const session = await stripe.billingPortal.sessions.create({
    customer: stripeCustomer.customerId,
    return_url: `${process.env.BETTER_AUTH_URL}${subscriptionPath(organizationId)}`,
  });

  if (!session.url)
    return toActionState("ERROR", "Session URL could not be created");

  redirect(session.url as Route);
};

export default createCustomerPortal;
