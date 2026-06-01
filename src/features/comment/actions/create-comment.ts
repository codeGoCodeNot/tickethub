"use server";

import fromErrorToActionState, {
  ActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import createActivityLog from "@/features/activity-logs/actions/create-activity-log";
import getAuthOrRedirect from "@/features/auth/queries/get-auth-or-redirect";
import prisma from "@/lib/prisma";
import { updateTag } from "next/cache";
import z from "zod";

const createCommentSchema = z.object({
  content: z.string().trim().min(1, "Content is required"),
});

const createComment = async (
  ticketId: string,
  _actionState: ActionState,
  formData: FormData,
) => {
  const user = await getAuthOrRedirect();
  let organizationId: string | null = null;

  try {
    const { content } = createCommentSchema.parse(
      Object.fromEntries(formData.entries()),
    );

    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      select: { organizationId: true },
    });

    if (!ticket) {
      return toActionState("ERROR", "Ticket not found");
    }

    organizationId = ticket.organizationId;

    await prisma.comment.create({
      data: {
        userId: user.id,
        ticketId,
        content,
      },
    });
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }

  if (organizationId) {
    await createActivityLog({
      organizationId,
      userId: user.id,
      action: "comment.created",
      metadata: { ticketId },
    });
    updateTag(`activity-log-${organizationId}`);
  }

  updateTag(`ticket-${ticketId}-comments`);
  return toActionState("SUCCESS", "Comment created");
};

export default createComment;
