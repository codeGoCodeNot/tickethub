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
import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
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

  // track created attachments to roll back in case of an error during the process of creating attachments or uploading files to s3
  const create: { id: string; key: string }[] = [];

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

      const key = generateS3Key({
        ticketId,
        attachmentId: attachment.id,
        filename,
        organizationId: ticket.organizationId,
      });

      // track before s3 call so the in-flight one rolls back too
      create.push({ id: attachment.id, key });

      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME!,
          Key: key,
          Body: buffer,
          ContentType: file.type,
        }),
      );
    }
  } catch (error) {
    await Promise.all(
      create.map(({ key }) =>
        s3
          .send(
            new DeleteObjectCommand({
              Bucket: process.env.AWS_BUCKET_NAME!,
              Key: key,
            }),
          )
          .catch(() => null),
      ),
    );
    await Promise.all(
      create.map(({ id }) =>
        prisma.attachment.delete({ where: { id } }).catch(() => null),
      ),
    );
    return fromErrorToActionState(error, formData);
  }

  updateTag(`ticket-${ticketId}-attachments`);
  return toActionState("SUCCESS", "Attachment is uploaded");
};

export default createAttachment;
