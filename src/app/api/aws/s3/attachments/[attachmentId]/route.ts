import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import getAuthOrRedirect from "@/features/auth/queries/get-auth-or-redirect";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";
import s3 from "@/lib/aws";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { generateS3Key } from "@/features/attachments/utils/generate-s3-key";
import isOwner from "@/features/auth/utils/is-owner";

type GetParams = {
  params: Promise<{ attachmentId: string }>;
};

export const GET = async (_request: NextRequest, { params }: GetParams) => {
  const user = await getAuthOrRedirect();

  const { attachmentId } = await params;

  const attachment = await prisma.attachment.findUnique({
    where: { id: attachmentId },
    include: { ticket: true, comment: { include: { ticket: true } } },
  });

  if (!attachment) return new Response("Not found", { status: 404 });

  let entityId: string;
  let organizationId: string;

  if (attachment.entity === "TICKET") {
    if (!attachment.ticket || !attachment.ticketId) {
      return new Response("Not found", { status: 404 });
    }
    entityId = attachment.ticketId;
    organizationId = attachment.ticket.organizationId;
  } else if (attachment.entity === "COMMENT") {
    if (
      !attachment.comment ||
      !attachment.commentId ||
      !attachment.comment.ticket
    ) {
      return new Response("Not found", { status: 404 });
    }
    entityId = attachment.commentId;
    organizationId = attachment.comment.ticket.organizationId;
  } else {
    return new Response("Bad request", { status: 400 });
  }

  // download auth: must be a member of the parent ticket's org
  const member = await prisma.member.findFirst({
    where: { userId: user.id, organizationId },
  });
  if (!member) return new Response("Forbidden", { status: 403 });

  const presignedUrl = await getSignedUrl(
    s3,
    new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: generateS3Key({
        entityId,
        entity: attachment.entity,
        organizationId,
        attachmentId,
        filename: attachment.filename,
      }),
    }),
    { expiresIn: 5 * 60 }, // URL expires in 5 minutes
  );

  return Response.redirect(presignedUrl);

  // const response = await fetch(presignedUrl);

  // const headers = new Headers();
  // headers.append(
  //   "content-disposition",
  //   `attachment; filename="${attachment.filename}"`,
  // );

  // return new Response(response.body, {
  //   headers,
  // });
};
