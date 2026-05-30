import { Attachment } from "@/generated/prisma/client";
import { attachmentDownloadPath } from "@/path";
import { LucideArrowUpRightFromSquare } from "lucide-react";
import Link from "next/link";

type AttachmentItemProps = {
  attachment: Attachment;
  buttons: React.ReactNode[];
};

const AttachmentItem = ({ attachment, buttons }: AttachmentItemProps) => {
  return (
    <div className="flex items-center justify-between gap-x-2">
      <Link
        href={attachmentDownloadPath(attachment.id)}
        className="flex gap-x-2 items-center text-sm truncate"
      >
        <LucideArrowUpRightFromSquare className="size-4" />
        <p className="text-xs text-muted-foreground">{attachment.filename}</p>
      </Link>
      <div className="flex gap-x-2">{buttons}</div>
    </div>
  );
};

export default AttachmentItem;
