"use server";

import { toActionState } from "@/components/form/utils/to-action-state";
import { getAuth } from "@/features/auth/queries/get-auth";
import isOwner from "@/features/auth/utils/is-owner";
import prisma from "@/lib/prisma";
import { generateS3Key } from "../utils/generate-s3-key";
import { getUploadUrl } from "@/lib/aws";

type Input = {
  ticketId: string;
  filename: string;
  mimeType: string;
};

const presignAttachmentUpload = async ({
  ticketId,
  filename,
  mimeType,
}: Input) => {
  const user = await getAuth();

  const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });

  if (!ticket || !isOwner(user, ticket))
    return toActionState(
      "ERROR",
      "Not authorized to upload attachment to this ticket",
    );

  const attachmentId = crypto.randomUUID();
  const key = generateS3Key({
    ticketId,
    attachmentId,
    filename,
    organizationId: ticket.organizationId,
  });

  const uploadUrl = await getUploadUrl(key, mimeType);

  return toActionState("SUCCESS", "", undefined, {
    attachmentId,
    key,
    uploadUrl,
  });
};

export default presignAttachmentUpload;
