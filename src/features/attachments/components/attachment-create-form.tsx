"use client";

import { useActionState } from "react";
import createAttachment from "../actions/create-attachment";
import { EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state";
import Form from "@/components/form/utils/form";
import { Input } from "@/components/ui/input";
import { ACCEPTED } from "../constants";
import { Button } from "@/components/ui/button";

type AttachmentCreateFormProps = {
  ticketId: string;
};

const AttachmentCreateForm = ({ ticketId }: AttachmentCreateFormProps) => {
  const [actionState, action, isPending] = useActionState(
    createAttachment.bind(null, ticketId),
    EMPTY_ACTION_STATE,
  );

  return (
    <Form action={action} actionState={actionState}>
      <Input
        type="file"
        name="files"
        id="files"
        multiple
        accept={ACCEPTED.join(",")}
      />

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
