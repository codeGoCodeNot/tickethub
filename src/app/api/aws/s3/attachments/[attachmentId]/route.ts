import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import getAuthOrRedirect from "@/features/auth/queries/get-auth-or-redirect";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";
import s3 from "@/lib/aws";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { generateS3Key } from "@/features/attachments/utils/generate-s3-key";

type GetParams = {
  params: Promise<{ attachmentId: string }>;
};

export const GET = async (request: NextRequest, { params }: GetParams) => {
  await getAuthOrRedirect();

  const { attachmentId } = await params;

  const attachment = await prisma.attachment.findUnique({
    where: { id: attachmentId },
    include: { ticket: true },
  });

  if (!attachment) return new Response("Not found", { status: 404 });

  const presignedUrl = await getSignedUrl(
    s3,
    new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: generateS3Key({
        attachmentId,
        filename: attachment.filename,
        organizationId: attachment.ticket.organizationId,
        ticketId: attachment.ticketId,
      }),
    }),
    { expiresIn: 5 * 60 }, // URL expires in 5 minutes
  );

  const response = await fetch(presignedUrl);

  const headers = new Headers();
  headers.append(
    "content-disposition",
    `attachment; filename="${attachment.filename}"`,
  );

  return new Response(response.body, {
    headers,
  });
};
