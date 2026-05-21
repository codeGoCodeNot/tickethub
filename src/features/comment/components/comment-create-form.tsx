"use client";

import { Textarea } from "@/components/ui/textarea";
import createComment from "../actions/create-comment";
import { Button } from "@/components/ui/button";
import { useActionState, useEffect } from "react";
import { EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state";
import Form from "@/components/form/utils/form";
import { LucideLoaderCircle } from "lucide-react";

type CommentCreateFormProps = {
  ticketId: string;
  onSuccess: () => void;
};

const CommentCreateForm = ({ ticketId, onSuccess }: CommentCreateFormProps) => {
  const [actionState, action, isPending] = useActionState(
    createComment.bind(null, ticketId),
    EMPTY_ACTION_STATE,
  );

  useEffect(() => {
    if (actionState.status === "SUCCESS") {
      onSuccess();
    }
  }, [actionState.status, actionState.timestamp]);

  return (
    <Form action={action} actionState={actionState}>
      <div className="flex flex-col gap-y-1">
        <Textarea name="content" placeholder="What's on your mind ..." />
        <p className="text-sm text-red-500">
          {actionState.fieldErrors?.["content"]?.[0] as string}
        </p>

        <Button type="submit" className="w-full">
          {isPending ? (
            <>
              <LucideLoaderCircle className="animate-spin" />
              <span>Creating Comment...</span>
            </>
          ) : (
            "Create Comment"
          )}
        </Button>
      </div>
    </Form>
  );
};

export default CommentCreateForm;
