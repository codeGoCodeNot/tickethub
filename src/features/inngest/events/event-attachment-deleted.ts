import s3 from "@/lib/aws";
import { inngest } from "@/lib/inngest";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

export type AttachmentDeleteArgs = {
  data: {
    key: string;
  };
};

export const eventAttachmentDeleted = inngest.createFunction(
  { id: "attachment-deleted", triggers: { event: "app/attachment.deleted" } },
  async ({ event }: { event: AttachmentDeleteArgs }) => {
    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: event.data.key,
      }),
    );
  },
);
