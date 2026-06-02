import { inngest } from "@/lib/inngest";
import prisma from "@/lib/prisma";
import stripe from "@/lib/stripe/stripe";

export type EventOrganizationCreatedArgs = {
  event: {
    data: {
      organizationId: string;
      byEmail: string;
    };
  };
};

export const eventOrganizationCreated = inngest.createFunction(
  {
    id: "organization-created",
    triggers: { event: "app/organization-created" },
  },
  async ({ event }: EventOrganizationCreatedArgs) => {
    const { organizationId, byEmail } = event.data;

    const organization = await prisma.organization.findUniqueOrThrow({
      where: { id: organizationId },
      //   include: { members: { select: { user: true } } },
    });

    const stripeCustomer = await stripe.customers.create({
      name: organization.name,
      email: byEmail,
      metadata: {
        organizationId: organization.id,
      },
    });

    await prisma.stripeCustomer.create({
      data: {
        organizationId,
        customerId: stripeCustomer.id,
      },
    });
  },
);
