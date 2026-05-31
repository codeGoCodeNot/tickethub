"use server";

import fromErrorToActionState, {
  toActionState,
} from "@/components/form/utils/to-action-state";
import { fileSchema } from "@/features/attachments/schema";
import { getAuth } from "@/features/auth/queries/get-auth";
import isOwner from "@/features/auth/utils/is-owner";
import prisma from "@/lib/prisma";
import { updateTag } from "next/cache";
import z from "zod";

type Input = {
  attachmentId: string;
  ticketId: string;
  filename: string;
};

const createAttachmentSchema = z.object({
  files: fileSchema,
});

const createAttachment = async ({
  attachmentId,
  ticketId,
  filename,
}: Input) => {
  const user = await getAuth();

  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
  });

  if (!ticket || !isOwner(user, ticket)) {
    return toActionState("ERROR", "Not authorized.");
  }

  try {
    await prisma.attachment.create({
      data: { id: attachmentId, filename, ticketId },
    });
  } catch (error) {
    return fromErrorToActionState(error);
  }

  updateTag(`ticket-${ticketId}-attachments`);
  return toActionState("SUCCESS", "Attachment is uploaded");
};

export default createAttachment;
