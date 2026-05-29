"use client";

import { Button } from "@/components/ui/button";
import useConfirmDialog from "@/features/hook/use-confirm-dialog";
import { LucideLoaderCircle, LucideTrash } from "lucide-react";
import deleteAttachment from "../actions/delete-attachment";
import { useTransition } from "react";
import { toast } from "sonner";

type AttachmentDeleteButtonProps = {
  id: string;
};

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
    description:
      "Are you sure you want to delete this attachment? This action cannot be undone.",
    trigger: (
      <Button variant="destructive" size="icon" disabled={isPending}>
        {isPending ? (
          <LucideLoaderCircle className="animate-spin" />
        ) : (
          <LucideTrash />
        )}
      </Button>
    ),
    action: deleteWithToast,
  });

  return (
    <>
      {deleteButton}
      {deleteDialog}
    </>
  );
};

export default AttachmentDeleteButton;
