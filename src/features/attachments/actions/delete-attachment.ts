"use server";

import fromErrorToActionState, {
  toActionState,
} from "@/components/form/utils/to-action-state";
import { getAuth } from "@/features/auth/queries/get-auth";
import isOwner from "@/features/auth/utils/is-owner";
import { inngest } from "@/lib/inngest";
import prisma from "@/lib/prisma";
import { updateTag } from "next/cache";
import { generateS3Key } from "../utils/generate-s3-key";

const deleteAttachment = async (id: string) => {
  const user = await getAuth();

  const attachment = await prisma.attachment.findUnique({
    where: { id },
    include: { ticket: true },
  });

  if (!attachment) {
    return toActionState("ERROR", "Attachment not found.");
  }

  if (!isOwner(user, attachment?.ticket))
    return toActionState(
      "ERROR",
      "You are not authorized to delete this attachment.",
    );

  try {
    const key = generateS3Key({
      attachmentId: attachment.id,
      filename: attachment.filename,
      organizationId: attachment.ticket.organizationId,
      ticketId: attachment.ticketId,
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

  updateTag(`ticket-${attachment?.ticketId}-attachments`);
  return toActionState("SUCCESS", "Attachment deleted.");
};

export default deleteAttachment;
