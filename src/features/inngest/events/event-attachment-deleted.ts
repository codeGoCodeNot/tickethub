import s3, { deleteObjectByPrefix } from "@/lib/aws";
import { inngest } from "@/lib/inngest";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

export type AttachmentDeleteArgs = {
  event: {
    data: { key: string } | { prefix: string };
  };
};

export const eventAttachmentDeleted = inngest.createFunction(
  { id: "attachment-deleted", triggers: { event: "app/attachment.deleted" } },
  async ({ event }: AttachmentDeleteArgs) => {
    if ("prefix" in event.data) {
      await deleteObjectByPrefix(event.data.prefix);
      return;
    }
    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: event.data.key,
      }),
    );
  },
);
