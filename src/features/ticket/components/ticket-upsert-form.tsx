"use client";

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
    { message: "" },
  );

  return (
    <form action={action} className="flex flex-col gap-y-5">
      <div className="flex flex-col gap-y-1">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" defaultValue={ticket?.title} />
      </div>

      <div className="flex flex-col gap-y-1">
        <Label htmlFor="content">Content</Label>
        <Textarea id="content" name="content" defaultValue={ticket?.content} />
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending && <LucideLoader2 className="animate-spin" />}
        {ticket ? "Update" : "Create"}
      </Button>
      {actionState.message && (
        <p className="text-sm text-green-500">{actionState.message}</p>
      )}
    </form>
  );
};

export default TicketUpsertForm;
