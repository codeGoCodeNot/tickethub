import prisma from "@/lib/prisma";
import stripe from "@/lib/stripe/stripe";

const getStripeProvisioning = async (
  organizationId: string | undefined | null,
) => {
  if (!organizationId)
    return {
      allowedTeamMembers: 0,
      currentTeamMembers: 0,
    };

  const [membershipCount, invitationCount, stripeCustomer] =
    await prisma.$transaction([
      prisma.member.count({
        where: { organizationId },
      }),
      prisma.invitation.count({
        where: { organizationId, status: "pending" }, // cancel don't count towards team members
      }),
      prisma.stripeCustomer.findUnique({
        where: { organizationId },
      }),
    ]);

  const currentTeamMembers = membershipCount + invitationCount;
  const isActive =
    stripeCustomer?.subscriptionStatus === "active" ||
    stripeCustomer?.subscriptionStatus === "trialing";

  if (!isActive || !stripeCustomer?.customerId) {
    return {
      allowedTeamMembers: 1,
      currentTeamMembers,
      hasActivePlan: false,
    };
  }

  const product = await stripe.products.retrieve(stripeCustomer.productId!);

  return {
    allowedTeamMembers: parseInt(product.metadata.allowedTeamMembers),
    currentTeamMembers,
    hasActivePlan: true,
  };
};

export default getStripeProvisioning;
