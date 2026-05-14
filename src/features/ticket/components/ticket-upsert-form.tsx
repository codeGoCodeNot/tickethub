"use client";

import Form from "@/components/form/utils/form";
import { EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state.ts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Ticket } from "@/generated/prisma/client";
import { LucideLoader2 } from "lucide-react";
import { useActionState } from "react";
import upsertTicket from "../actions/upsert-ticket";

type TicketUpsertProps = {
  ticket?: Ticket;
};

const TicketUpsertForm = ({ ticket }: TicketUpsertProps) => {
  const [actionState, action, isPending] = useActionState(
    upsertTicket.bind(null, ticket?.id ?? ""),
    EMPTY_ACTION_STATE,
  );

  return (
    <Form action={action} actionState={actionState}>
      <div className="flex flex-col gap-y-1">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          defaultValue={
            (actionState.payload?.get("title") as string) ?? ticket?.title
          }
        />
        {
          <p className="text-sm text-red-500">
            {actionState.fieldErrors?.["title"]?.[0]}
          </p>
        }
      </div>

      <div className="flex flex-col gap-y-1">
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          name="content"
          defaultValue={
            (actionState.payload?.get("content") as string) ?? ticket?.content
          }
        />
        <p className="text-sm text-red-500">
          {actionState.fieldErrors?.["content"]?.[0] as string}
        </p>
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending && <LucideLoader2 className="animate-spin" />}
        {ticket ? "Update" : "Create"}
      </Button>
    </Form>
  );
};

export default TicketUpsertForm;
