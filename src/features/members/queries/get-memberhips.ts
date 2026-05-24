import prisma from "@/lib/prisma";

const getMemberships = async (organizationId: string) => {
  return await prisma.member.findMany({
    where: { organizationId },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          emailVerified: true,
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });
};

export default getMemberships;
