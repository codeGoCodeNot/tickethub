import {
  DeleteObjectsCommand,
  paginateListObjectsV2,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const getUploadUrl = async (key: string, contentType: string) =>
  getSignedUrl(
    s3,
    new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
      ContentType: contentType,
    }),
    { expiresIn: 60 * 5 }, // URL expires in 5 minutes
  );

export const deleteObjectByPrefix = async (prefix: string) => {
  const Bucket = process.env.AWS_BUCKET_NAME!;

  for await (const page of paginateListObjectsV2(
    { client: s3 },
    { Bucket, Prefix: prefix },
  )) {
    const keys = (page.Contents ?? []).map((object) => ({ Key: object.Key! }));

    if (keys.length > 0) {
      await s3.send(
        new DeleteObjectsCommand({
          Bucket,
          Delete: { Objects: keys, Quiet: true },
        }),
      );
    }
  }
};

export default s3;
