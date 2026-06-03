import prisma from "@/lib/prisma";

const getStripeCustomer = async (organizationId: string) => {
  if (!organizationId) return null;

  return await prisma.stripeCustomer.findUnique({
    where: {
      organizationId,
    },
  });
};

export default getStripeCustomer;
