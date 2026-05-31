"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { LucideLoaderCircle, LucideX } from "lucide-react";
import { useEffect, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import createAttachment from "../actions/create-attachment";
import deleteAttachment from "../actions/delete-attachment";
import presignAttachmentUpload from "../actions/presign-attachment-upload";
import { ACCEPTED } from "../constants";

type AttachmentCreateFormProps = {
  ticketId: string;
};

type Preview = {
  name: string;
  type: string;
  url: string | null;
};

const AttachmentCreateForm = ({ ticketId }: AttachmentCreateFormProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<Preview[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const next = files.map((file) => ({
      name: file.name,
      type: file.type,
      url: ACCEPTED.includes(file.type) ? URL.createObjectURL(file) : null,
    }));
    setPreviews(next);

    return () => {
      next.forEach((preview) => {
        if (preview.url) URL.revokeObjectURL(preview.url);
      });
    };
  }, [files]);

  const fallback = (
    <div className="flex size-16 items-center justify-center rounded p-1 text-center text-[10px] leading-tight text-muted-foreground ring-1 ring-border">
      {" "}
      Preview not available
    </div>
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) setFiles(Array.from(event.target.files));
  };

  const removeFile = (index: number) => {
    const next = files.filter((_, i) => i !== index);
    setFiles(next);

    const dataTransfer = new DataTransfer();
    next.forEach((file) => dataTransfer.items.add(file));
    if (inputRef.current) inputRef.current.files = dataTransfer.files;
  };

  const handleUpload = () => {
    if (files.length === 0) return;
    startTransition(async () => {
      const toastId = toast.loading("Uploading attachments...");
      const created: string[] = [];

      try {
        for (const file of files) {
          const presign = await presignAttachmentUpload({
            ticketId,
            filename: file.name,
            mimeType: file.type,
          });
          if (presign.status === "ERROR") {
            throw new Error(presign.message || "Failed to get upload URL");
          }
          const { attachmentId, uploadUrl } = presign.data as {
            attachmentId: string;
            key: string;
            uploadUrl: string;
          };

          const res = await fetch(uploadUrl, {
            method: "PUT",
            headers: { "Content-Type": file.type },
            body: file,
          });
          if (!res.ok) throw new Error("Failed to upload file to storage");

          const create = await createAttachment({
            ticketId,
            attachmentId,
            filename: file.name,
          });
          if (create.status === "ERROR") throw new Error(create.message);

          created.push(attachmentId);
        }

        toast.success("Uploaded", { id: toastId });
        setFiles([]);
        if (inputRef.current) inputRef.current.value = "";
      } catch (error) {
        console.error("Error uploading attachments:", error);
        await Promise.all(
          created.map((id) => deleteAttachment(id).catch(() => null)),
        );
        toast.error("Failed to upload attachments.", { id: toastId });
      }
    });
  };

  return (
    <div className="flex flex-col gap-y-1">
      <Input
        ref={inputRef}
        type="file"
        name="files"
        id="files"
        multiple
        accept={ACCEPTED.join(",")}
        onChange={handleChange}
      />

      <div className="flex flex-wrap gap-3">
        {previews.map((preview, index) => (
          <div key={`${preview.name}-${index}`} className="relative size-16">
            {preview.url === null || preview.type === "application/pdf" ? (
              fallback
            ) : (
              <Dialog>
                <DialogTrigger asChild>
                  <button
                    type="button"
                    className="group relative block size-16 cursor-pointer overflow-hidden rounded ring-1 ring-border"
                  >
                    <img
                      src={preview.url}
                      alt={preview.name}
                      className="size-16 object-cover"
                    />
                    <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                      View
                    </span>
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <DialogTitle className="truncate text-sm">
                    {preview.name}
                  </DialogTitle>
                  <img
                    src={preview.url}
                    alt={preview.name}
                    className="max-h-[80vh] w-full object-contain"
                  />
                </DialogContent>
              </Dialog>
            )}

            <button
              type="button"
              onClick={() => removeFile(index)}
              aria-label={`Remove ${preview.name}`}
              className="absolute -right-2 -top-2 z-10 flex size-5 items-center justify-center rounded-full bg-destructive text-white shadow ring-1 ring-background hover:bg-destructive/90"
            >
              <LucideX className="size-3" />
            </button>
          </div>
        ))}
      </div>

      <Button type="submit" disabled={isPending} onClick={handleUpload}>
        {isPending ? (
          <>
            <LucideLoaderCircle className="animate-spin" /> Uploading...
          </>
        ) : (
          "Upload"
        )}
      </Button>
    </div>
  );
};

export default AttachmentCreateForm;
