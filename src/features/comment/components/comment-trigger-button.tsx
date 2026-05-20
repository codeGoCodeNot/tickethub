"use client";

import { Button } from "@/components/ui/button";
import { useCommentEditStore } from "../stores/comment-edit-store";
import { LucideFileEdit } from "lucide-react";

type CommentTriggerButtonProps = {
  commentId: string;
};

const CommentTriggerButton = ({ commentId }: CommentTriggerButtonProps) => {
  const setEditingCommentId = useCommentEditStore(
    (state) => state.setEditingCommentId,
  );

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={() => setEditingCommentId(commentId)}
    >
      <LucideFileEdit />
    </Button>
  );
};

export default CommentTriggerButton;
