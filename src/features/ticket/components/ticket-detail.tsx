import Placeholder from "@/components/placeholder";
import { Button } from "@/components/ui/button";
import { homePath } from "@/path";
import Link from "next/link";
import getTicket from "../queries/get-ticket";
import TicketItem from "./ticket-item";

type TicketDetailProps = {
  ticketId: string;
};

const TicketDetail = async ({ ticketId }: TicketDetailProps) => {
  const ticket = await getTicket(ticketId);

  if (!ticket) {
    return (
      <Placeholder
        label="Ticket not found"
        button={
          <Button asChild variant="outline">
            <Link href={homePath()}>Go back to tickets</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="flex flex-col flex-1 items-center gap-y-4 animate-fade-from-top">
      <TicketItem ticket={ticket} isDetail />
    </div>
  );
};

export default TicketDetail;
