"use client";

import { Button } from "@/components/ui/button";
import useConfirmDialog from "@/features/hook/use-confirm-dialog";
import { LucideLoaderCircle, LucideTrash2 } from "lucide-react";
import { toast } from "sonner";
import deleteComment from "../actions/delete-comment";
import { useTransition } from "react";

type CommentDeleteButtonProps = {
  id: string;
};

const CommentDeleteButton = ({
  id,
}: CommentDeleteButtonProps & { onDelete?: (id: string) => void }) => {
  const [isPending, startTransition] = useTransition();

  const deleteWithToast = async () => {
    startTransition(async () => {
      const toastId = toast.loading("Deleting comment...");
      try {
        const result = await deleteComment(id);
        if (result?.status === "ERROR") {
          toast.error(result.message, { id: toastId });
          return;
        }
        toast.dismiss(toastId);
        toast.success("Comment deleted");
      } catch {
        toast.error("Failed to delete comment.", { id: toastId });
      }
    });
  };
  const [deleteDialogTrigger, deleteDialog] = useConfirmDialog({
    action: deleteWithToast,
    trigger: (
      <Button
        variant="ghost"
        size="icon-sm"
        className="text-destructive"
        disabled={isPending}
      >
        {isPending ? (
          <LucideLoaderCircle className="animate-spin" />
        ) : (
          <LucideTrash2 />
        )}
      </Button>
    ),
    title: "Are you sure you want to delete this comment?",
    description: "This action cannot be undone.",
  });

  return (
    <>
      {deleteDialog}
      {deleteDialogTrigger}
    </>
  );
};

export default CommentDeleteButton;
