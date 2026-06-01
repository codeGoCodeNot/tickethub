"use server";

import fromErrorToActionState, {
  toActionState,
} from "@/components/form/utils/to-action-state";
import { getAuth } from "@/features/auth/queries/get-auth";
import isOwner from "@/features/auth/utils/is-owner";
import { inngest } from "@/lib/inngest";
import prisma from "@/lib/prisma";
import { ticketPath } from "@/path";
import { revalidatePath } from "next/cache";
import { generateS3Key } from "../utils/generate-s3-key";
import createActivityLog from "@/features/activity-logs/actions/create-activity-log";

const deleteAttachment = async (id: string) => {
  const user = await getAuth();
  let entityId: string;
  let organizationId: string;
  let ticketId: string;

  const attachment = await prisma.attachment.findUnique({
    where: { id },
    include: { ticket: true, comment: { include: { ticket: true } } },
  });

  if (!attachment) {
    return toActionState("ERROR", "Attachment not found.");
  }

  if (attachment.entity === "TICKET") {
    if (!attachment.ticket || !attachment.ticketId) {
      return toActionState("ERROR", "Ticket attachment is missing its ticket.");
    }
    if (!isOwner(user, attachment.ticket)) {
      return toActionState(
        "ERROR",
        "Not authorized to delete this attachment.",
      );
    }
    entityId = attachment.ticketId;
    organizationId = attachment.ticket.organizationId;
    ticketId = attachment.ticketId;
  } else if (attachment.entity === "COMMENT") {
    if (
      !attachment.comment ||
      !attachment.commentId ||
      !attachment.comment.ticket
    ) {
      return toActionState(
        "ERROR",
        "Comment attachment is missing its comment.",
      );
    }
    if (attachment.comment.userId !== user?.id) {
      return toActionState(
        "ERROR",
        "Not authorized to delete this attachment.",
      );
    }
    entityId = attachment.commentId;
    organizationId = attachment.comment.ticket.organizationId;
    ticketId = attachment.comment.ticket.id;
  } else {
    return toActionState("ERROR", "Invalid attachment entity.");
  }

  try {
    const key = generateS3Key({
      entity: attachment.entity,
      entityId,
      organizationId,
      attachmentId: attachment.id,
      filename: attachment.filename,
    });

    await prisma.attachment.delete({
      where: { id },
    });

    // Notify Inngest about the deleted attachment from s3
    await inngest.send({
      name: "app/attachment.deleted",
      data: { key },
    });
  } catch (error) {
    return fromErrorToActionState(error);
  }

  await createActivityLog({
    organizationId,
    userId: user!.id,
    action: "attachment.deleted",
    metadata: { filename: attachment.filename, ticketId },
  });

  revalidatePath(ticketPath(ticketId));
  return toActionState("SUCCESS", "Attachment deleted.");
};

export default deleteAttachment;
