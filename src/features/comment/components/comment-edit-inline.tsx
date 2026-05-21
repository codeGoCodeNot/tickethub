"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Form from "@/components/form/utils/form";
import { EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state";
import { useActionState, useEffect } from "react";
import updateComment from "../actions/update-comment";
import { useCommentEditStore } from "../stores/comment-edit-store";
import { LucideLoaderCircle } from "lucide-react";

type CommentEditInlineProps = {
  commentId: string;
  content: string;
  onSuccess: () => void;
};

const CommentEditInline = ({
  commentId,
  content,
  onSuccess,
}: CommentEditInlineProps) => {
  const { editingCommentId, setEditingCommentId } = useCommentEditStore();
  const isEditing = editingCommentId === commentId;

  const [actionState, action, isPending] = useActionState(
    updateComment.bind(null, commentId),
    EMPTY_ACTION_STATE,
  );

  useEffect(() => {
    if (actionState.status === "SUCCESS") {
      setEditingCommentId(null);
      onSuccess();
    }
  }, [actionState.status, actionState.timestamp]);

  if (!isEditing) return null;

  return (
    <Form action={action} actionState={actionState}>
      <div className="flex flex-col gap-y-1">
        <Textarea name="content" defaultValue={content} />
        <p className="text-sm text-red-500">
          {actionState.fieldErrors?.["content"]?.[0]}
        </p>
        <div className="flex gap-x-1">
          <Button type="submit" size="sm">
            {isPending ? (
              <>
                <LucideLoaderCircle className="animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              "Save"
            )}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => setEditingCommentId(null)}
          >
            Cancel
          </Button>
        </div>
      </div>
    </Form>
  );
};

export default CommentEditInline;
