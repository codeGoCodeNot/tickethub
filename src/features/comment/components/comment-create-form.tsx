"use client";

import { Textarea } from "@/components/ui/textarea";
import createComment from "../actions/create-comment";
import { Button } from "@/components/ui/button";
import { useActionState } from "react";
import { EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state";
import Form from "@/components/form/utils/form";
import { LucideLoaderCircle } from "lucide-react";

type CommentCreateFormProps = {
  ticketId: string;
};

const CommentCreateForm = ({ ticketId }: CommentCreateFormProps) => {
  const [actionState, action, isPending] = useActionState(
    createComment.bind(null, ticketId),
    EMPTY_ACTION_STATE,
  );

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
