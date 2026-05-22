import prisma from "@/lib/prisma";
import { cacheTag } from "next/cache";

const getOrganizationsByUser = async (userId: string | undefined) => {
  "use cache";
  cacheTag("organizations", `user-${userId}`);
  if (!userId) return [];

  const organizations = await prisma.organization.findMany({
    where: {
      members: {
        some: { userId: userId },
      },
    },
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
