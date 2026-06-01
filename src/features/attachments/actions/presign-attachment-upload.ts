"use server";

import { toActionState } from "@/components/form/utils/to-action-state";
import { getAuth } from "@/features/auth/queries/get-auth";
import isOwner from "@/features/auth/utils/is-owner";
import prisma from "@/lib/prisma";
import { generateS3Key } from "../utils/generate-s3-key";
import { getUploadUrl } from "@/lib/aws";

type Input = {
  entityId: string;
  entity: string;
  filename: string;
  mimeType: string;
};

const presignAttachmentUpload = async ({
  entityId,
  entity,
  filename,
  mimeType,
}: Input) => {
  const user = await getAuth();

  let organizationId: string;

  if (entity === "TICKET") {
    const ticket = await prisma.ticket.findUnique({ where: { id: entityId } });
    if (!ticket || !isOwner(user, ticket)) {
      return toActionState("ERROR", "Not authorized to upload to this ticket");
    }
    organizationId = ticket.organizationId;
  } else if (entity === "COMMENT") {
    const comment = await prisma.comment.findUnique({
      where: { id: entityId },
      include: { ticket: true },
    });
    if (!comment || !comment.ticket) {
      return toActionState("ERROR", "Comment not found");
    }
    if (comment.userId !== user?.id) {
      return toActionState("ERROR", "You can only attach to your own comment");
    }
    organizationId = comment.ticket.organizationId;
  } else {
    return toActionState("ERROR", "Invalid entity type");
  }

  const attachmentId = crypto.randomUUID();
  const key = generateS3Key({
    entityId,
    entity,
    attachmentId,
    filename,
    organizationId,
  });

  const uploadUrl = await getUploadUrl(key, mimeType);

  return toActionState("SUCCESS", "", undefined, {
    attachmentId,
    key,
    uploadUrl,
  });
};

export default presignAttachmentUpload;
