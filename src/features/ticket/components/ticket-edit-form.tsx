import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Ticket } from "@/generated/prisma/client";
import editTicket from "../actions/edit-ticket";

type TicketEditFormProps = {
  ticket: Ticket;
};

const TicketEditForm = ({ ticket }: TicketEditFormProps) => {
  return (
    <form
      action={editTicket.bind(null, ticket.id)}
      className="flex flex-col gap-y-5"
    >
      <div className="flex flex-col gap-y-1">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" defaultValue={ticket.title} />
      </div>

      <div className="flex flex-col gap-y-1">
        <Label htmlFor="content">Content</Label>
        <Textarea id="content" name="content" defaultValue={ticket.content} />
      </div>

      <Button type="submit">Update</Button>
    </form>
  );
};

export default TicketEditForm;
