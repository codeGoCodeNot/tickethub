"use server";

import fromErrorToActionState, {
  ActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { fileSchema } from "@/features/attachments/schema";
import { getAuth } from "@/features/auth/queries/get-auth";
import isOwner from "@/features/auth/utils/is-owner";
import s3 from "@/lib/aws";
import prisma from "@/lib/prisma";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { updateTag } from "next/cache";
import z from "zod";
import { generateS3Key } from "../utils/generate-s3-key";

const createAttachmentSchema = z.object({
  files: fileSchema,
});

const createAttachment = async (
  ticketId: string,
  _actionState: ActionState,
  formData: FormData,
) => {
  const user = await getAuth();

  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
  });

  if (!ticket) {
    return toActionState("ERROR", "Ticket not found");
  }

  if (!isOwner(user, ticket)) {
    return toActionState("ERROR", "You are not the owner of this ticket");
  }

  try {
    const { files } = createAttachmentSchema.parse({
      files: formData.getAll("files"),
    });

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const filename = file.name;

      const attachment = await prisma.attachment.create({
        data: {
          filename,
          ticketId,
        },
      });

      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME!,
          Key: generateS3Key({
            attachmentId: attachment.id,
            filename,
            organizationId: ticket.organizationId,
            ticketId,
          }),
          Body: buffer,
          ContentType: file.type,
        }),
      );
    }
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }

  updateTag(`ticket-${ticketId}-attachments`);
  return toActionState("SUCCESS", "Attachment is uploaded");
};

export default createAttachment;
