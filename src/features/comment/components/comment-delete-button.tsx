"use client";

import { Button } from "@/components/ui/button";
import useConfirmDialog from "@/features/hook/use-confirm-dialog";
import { LucideTrash2 } from "lucide-react";
import { toast } from "sonner";
import deleteComment from "../actions/delete-comment";

type CommentDeleteButtonProps = {
  id: string;
};

const CommentDeleteButton = ({ id }: CommentDeleteButtonProps) => {
  const deleteWithToast = async () => {
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
  };
  const [deleteDialogTrigger, deleteDialog] = useConfirmDialog({
    action: deleteWithToast,
    trigger: (
      <Button variant="destructive" size="icon">
        <LucideTrash2 />
      </Button>
    ),
    title: "Are you sure you want to delete this comment?",
  });

  return (
    <>
      {deleteDialog}
      {deleteDialogTrigger}
    </>
  );
};

export default CommentDeleteButton;
