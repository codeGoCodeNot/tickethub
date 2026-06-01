"use server";

import fromErrorToActionState, {
  toActionState,
} from "@/components/form/utils/to-action-state";
import { fileSchema } from "@/features/attachments/schema";
import { getAuth } from "@/features/auth/queries/get-auth";
import isOwner from "@/features/auth/utils/is-owner";
import { AttachmentEntity } from "@/generated/prisma/enums";
import prisma from "@/lib/prisma";
import { updateTag } from "next/cache";
import z from "zod";

type Input = {
  entityId: string;
  entity: AttachmentEntity;
  attachmentId: string;
  filename: string;
};

const createAttachment = async ({
  entityId,
  entity,
  attachmentId,
  filename,
}: Input) => {
  const user = await getAuth();

  try {
    if (entity === "TICKET") {
      const ticket = await prisma.ticket.findUnique({
        where: { id: entityId },
      });
      if (!ticket || !isOwner(user, ticket))
        return toActionState(
          "ERROR",
          "Not authorized to upload attachment to this ticket",
        );
      await prisma.attachment.create({
        data: {
          id: attachmentId,
          filename,
          entity,
          ticketId: entityId,
        },
      });
      updateTag(`ticket-${entityId}-attachments`);
    } else if (entity === "COMMENT") {
      const comment = await prisma.comment.findUnique({
        where: { id: entityId },
      });
      if (!comment || comment.userId !== user?.id) {
        return toActionState("ERROR", "Not authorized");
      }
      await prisma.attachment.create({
        data: {
          id: attachmentId,
          filename,
          entity,
          commentId: entityId,
        },
      });
      updateTag(`comment-${entityId}-attachments`);
    } else {
      return toActionState("ERROR", "Invalid entity type");
    }
  } catch (error) {
    return fromErrorToActionState(error);
  }

  return toActionState("SUCCESS", "Attachment is uploaded");
};

export default createAttachment;
