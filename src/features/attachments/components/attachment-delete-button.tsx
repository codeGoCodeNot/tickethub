"use client";

import { Button } from "@/components/ui/button";
import useConfirmDialog from "@/features/hook/use-confirm-dialog";
import { LucideLoaderCircle, LucideX } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import deleteAttachment from "../actions/delete-attachment";

type AttachmentDeleteButtonProps = { id: string };

const AttachmentDeleteButton = ({ id }: AttachmentDeleteButtonProps) => {
  const [isPending, startTransition] = useTransition();

  const deleteWithToast = () => {
    startTransition(async () => {
      const toastId = toast.loading("Deleting attachment...");
      try {
        const result = await deleteAttachment(id);
        if (result?.status === "ERROR") {
          toast.error(result.message, { id: toastId });
          return;
        }
        toast.success("Attachment deleted", { id: toastId });
      } catch {
        toast.error("Failed to delete attachment.", { id: toastId });
      }
    });
  };

  const [deleteButton, deleteDialog] = useConfirmDialog({
    title: "Delete Attachment",
    description: "Are you sure you want to delete this attachment?",
    action: deleteWithToast,
    trigger: (
      <Button
        type="button"
        aria-label="Delete attachment"
        disabled={isPending}
        className="flex size-5 items-center justify-center rounded-full bg-destructive p-0 text-white shadow ring-1 ring-background hover:bg-destructive/90"
      >
        {isPending ? (
          <LucideLoaderCircle className="size-3 animate-spin" />
        ) : (
          <LucideX className="size-3" />
        )}
      </Button>
    ),
  });

  return (
    <>
      {deleteButton}
      {deleteDialog}
    </>
  );
};

export default AttachmentDeleteButton;
