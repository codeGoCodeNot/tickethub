import prisma from "@/lib/prisma";
import { cacheTag } from "next/cache";

const getActivityLogs = async (organizationId: string) => {
  "use cache";
  cacheTag(`activity-log-${organizationId}`);
  return await prisma.activityLog.findMany({
    where: { organizationId },
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, image: true } },
    },
  });
};

export default getActivityLogs;
