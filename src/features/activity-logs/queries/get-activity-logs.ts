import prisma from "@/lib/prisma";
import { cacheTag } from "next/cache";

const getActivityLogs = async (organizationId: string, page = 0, size = 10) => {
  "use cache";
  cacheTag(`activity-log-${organizationId}`);

  const skip = page * size;
  const take = size;

  const [list, count] = await Promise.all([
    prisma.activityLog.findMany({
      where: { organizationId },
      orderBy: { createdAt: "desc" },
      skip,
      take,
      include: {
        user: { select: { name: true, image: true } },
      },
    }),
    prisma.activityLog.count({ where: { organizationId } }),
  ]);

  return {
    list,
    metadata: { count, hasNextPage: count > skip + take },
  };
};

export default getActivityLogs;
