import { ActivityAction } from "@/generated/prisma/enums";
import prisma from "@/lib/prisma";
import { updateTag } from "next/cache";

type CreateActivityLogInput = {
  organizationId: string;
  userId: string;
  action: ActivityAction;
  metadata?: Record<string, any>;
};

const createActivityLog = async (input: CreateActivityLogInput) => {
  try {
    await prisma.activityLog.create({
      data: {
        organizationId: input.organizationId,
        userId: input.userId,
        action: input.action,
        metadata: input.metadata,
      },
    });
    updateTag(`activity-log-${input.organizationId}`);
  } catch {
    // log silently — don't break the main action if logging fails
  }
};

export default createActivityLog;
