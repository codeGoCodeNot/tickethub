import { Attachment } from "@/generated/prisma/client";
import { attachmentDownloadPath } from "@/path";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";

type AttachmentItemProps = {
  attachment: Attachment;
  buttons: React.ReactNode[];
};

const isImage = (name: string) => /\.(png|jpe?g|gif|webp)$/i.test(name);

const AttachmentItem = ({ attachment, buttons }: AttachmentItemProps) => {
  const url = attachmentDownloadPath(attachment.id);

  return (
    <div className="relative size-16">
      {isImage(attachment.filename) ? (
        <Dialog>
          <DialogTrigger asChild>
            <button
              type="button"
              className="group relative block size-16 cursor-pointer overflow-hidden rounded ring-1 ring-border"
            >
              <img
                src={url}
                alt={attachment.filename}
                loading="lazy"
                className="size-16 object-cover"
              />
              <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                View
              </span>
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogTitle className="truncate text-sm">
              {attachment.filename}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Preview of {attachment.filename}
            </DialogDescription>
            <img
              src={url}
              alt={attachment.filename}
              className="max-h-[80vh] w-full object-contain"
            />
          </DialogContent>
        </Dialog>
      ) : (
        <div className="flex size-16 items-center justify-center rounded p-1 text-center text-[10px] leading-tight text-muted-foreground ring-1 ring-border">
          Preview not available
        </div>
      )}

      {/* corner X badge overlay */}
      <div className="absolute -right-2 -top-2 z-10">{buttons}</div>
    </div>
  );
};

export default AttachmentItem;
