"use server";

import fromErrorToActionState, {
  toActionState,
} from "@/components/form/utils/to-action-state";
import getAuthOrRedirect from "@/features/auth/queries/get-auth-or-redirect";
import { inngest } from "@/lib/inngest";
import prisma from "@/lib/prisma";
import { updateTag } from "next/cache";

const deleteComment = async (id: string) => {
  const user = await getAuthOrRedirect();

  const existingComment = await prisma.comment.findUnique({
    where: { id },
    include: { ticket: true },
  });

  if (!existingComment) return toActionState("ERROR", "Comment not found");
  if (!existingComment.ticket)
    return toActionState("ERROR", "Comment's ticket not found");
  if (existingComment.userId !== user.id)
    return toActionState("ERROR", "Not authorized to delete this comment");

  try {
    await prisma.comment.delete({
      where: { id },
    });
    await inngest.send({
      name: "app/attachment.deleted",
      data: {
        prefix: `${existingComment.ticket.organizationId}/COMMENT/${id}/`,
      },
    });
  } catch (error) {
    return fromErrorToActionState(error);
  }

  updateTag(`comment-${id}-attachments`);
  updateTag(`ticket-${existingComment.ticketId}-comments`);

  return toActionState("SUCCESS", "Comment deleted");
};

export default deleteComment;
