import prisma from "@/lib/prisma";

const getInvitations = async (organizationId: string) => {
  return await prisma.invitation.findMany({
    where: { organizationId },
    orderBy: { createdAt: "desc" },
  });
};

export default getInvitations;
