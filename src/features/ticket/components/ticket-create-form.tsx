import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import createTicket from "../actions/create-ticket";

const TicketCreateForm = () => {
  return (
    <form action={createTicket} className="flex flex-col gap-y-5">
      <div className="flex flex-col gap-y-1">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" />
      </div>

      <div className="flex flex-col gap-y-1">
        <Label htmlFor="content">Content</Label>
        <Textarea id="content" name="content" />
      </div>

      <Button type="submit">Create</Button>
    </form>
  );
};

export default TicketCreateForm;
