"use server";

import prisma from "@/lib/prisma";

const getOrganizationsByUser = async (userId: string | undefined) => {
  const organizations = await prisma.organization.findMany({
    where: {
      members: {
        some: { userId: userId },
      },
    },
    orderBy: { createdAt: "desc" },
    include: {
      members: {
        where: { userId: userId },
      },
      _count: {
        select: { members: true },
      },
    },
  });

  return organizations.map(({ members, ...organization }) => ({
    ...organization,
    membershipByUser: members[0],
  }));
};

export default getOrganizationsByUser;
