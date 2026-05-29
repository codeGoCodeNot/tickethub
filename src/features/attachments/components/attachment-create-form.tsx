"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import createAttachment from "../actions/create-attachment";
import { EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state";
import Form from "@/components/form/utils/form";
import { Input } from "@/components/ui/input";
import { ACCEPTED } from "../constants";
import { Button } from "@/components/ui/button";
import { LucideX } from "lucide-react";

type AttachmentCreateFormProps = {
  ticketId: string;
};

type Preview = {
  name: string;
  url: string | null;
};

const AttachmentCreateForm = ({ ticketId }: AttachmentCreateFormProps) => {
  const [actionState, action, isPending] = useActionState(
    createAttachment.bind(null, ticketId),
    EMPTY_ACTION_STATE,
  );

  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<Preview[]>([]);

  useEffect(() => {
    const next = files.map((file) => ({
      name: file.name,
      url: file.type.startsWith("image/") ? URL.createObjectURL(file) : null,
    }));
    setPreviews(next);

    return () => {
      next.forEach((preview) => {
        if (preview.url) URL.revokeObjectURL(preview.url);
      });
    };
  }, [files]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles(Array.from(event.target.files));
    }
  };

  const removeFile = (index: number) => {
    const next = files.filter((_, i) => i !== index);
    setFiles(next);

    const dataTransfer = new DataTransfer();
    next.forEach((file) => dataTransfer.items.add(file));
    if (inputRef.current) inputRef.current.files = dataTransfer.files;
  };

  return (
    <Form action={action} actionState={actionState}>
      <Input
        type="file"
        name="files"
        id="files"
        multiple
        accept={ACCEPTED.join(",")}
        onChange={handleChange}
        ref={inputRef}
      />

      {previews.map((preview, index) => (
        <div key={`${preview.name}-${index}`} className="relative size-16">
          {preview.url ? (
            <img
              src={preview.url}
              alt={preview.name}
              className="size-16 rounded object-cover ring-1 ring-border"
            />
          ) : (
            <div className="flex size-16 items-center justify-center rounded p-1 text-center text-[10px] leading-tight text-muted-foreground ring-1 ring-border">
              {" "}
              Preview not available
            </div>
          )}
          <button
            type="button"
            onClick={() => removeFile(index)}
            aria-label={`Remove ${preview.name}`}
            className="absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full bg-destructive text-white shadow ring-1 ring-background hover:bg-destructive/90"
          >
            <LucideX className="size-3" />
          </button>
        </div>
      ))}

      <p className="text-sm text-red-500">
        {actionState.fieldErrors?.["files"]?.[0]}
      </p>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Uploading..." : "Upload"}
      </Button>
    </Form>
  );
};

export default AttachmentCreateForm;
