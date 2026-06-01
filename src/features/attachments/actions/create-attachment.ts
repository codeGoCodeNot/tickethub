"use server";

import fromErrorToActionState, {
  toActionState,
} from "@/components/form/utils/to-action-state";
import { getAuth } from "@/features/auth/queries/get-auth";
import isOwner from "@/features/auth/utils/is-owner";
import { AttachmentEntity } from "@/generated/prisma/enums";
import prisma from "@/lib/prisma";
import { ticketPath } from "@/path";
import { revalidatePath } from "next/cache";

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
  let ticketId: string;

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
      ticketId = entityId;
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
      ticketId = comment.ticketId;
    } else {
      return toActionState("ERROR", "Invalid entity type");
    }
  } catch (error) {
    return fromErrorToActionState(error);
  }

  revalidatePath(ticketPath(ticketId));
  return toActionState("SUCCESS", "Attachment is uploaded");
};

export default createAttachment;
