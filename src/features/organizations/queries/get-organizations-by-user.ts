import prisma from "@/lib/prisma";
import { cacheTag } from "next/cache";

const getOrganizationsByUser = async (userId: string | undefined) => {
  "use cache";
  cacheTag("organizations", `user-${userId}`);
  if (!userId) return [];

  return await prisma.organization.findMany({
    where: {
      members: {
        some: { userId: userId },
      },
    },
    include: {
      members: {
        where: { userId: userId },
      },
    },
  });
};

export default getOrganizationsByUser;
