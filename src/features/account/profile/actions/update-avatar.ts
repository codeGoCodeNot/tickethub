"use server";

import { auth } from "@/lib/auth";
import s3 from "@/lib/aws";
import prisma from "@/lib/prisma";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { headers } from "next/headers";

export default async function updateAvatar(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  const file = formData.get("avatar") as File | null;
  if (!file || file.size === 0) return;

  const buffer = Buffer.from(await file.arrayBuffer());
  const key = `avatars/${session.user.id}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    }),
  );

  // requires the avatars/ prefix to have public read access in your S3 bucket policy
  const url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}?t=${Date.now()}`;

  return url;
}
