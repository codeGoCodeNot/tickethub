import {
  DeleteObjectsCommand,
  paginateListObjectsV2,
  S3Client,
} from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

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
