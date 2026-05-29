import { Attachment } from "@/generated/prisma/client";

type AttachmentItemProps = {
  attachment: Attachment;
  buttons: React.ReactNode[];
};

const AttachmentItem = ({ attachment, buttons }: AttachmentItemProps) => {
  return (
    <div className="flex items-center justify-between gap-x-2">
      <p className="text-xs text-muted-foreground">{attachment.filename}</p>
      <div className="flex gap-x-2">{buttons}</div>
    </div>
  );
};

export default AttachmentItem;
