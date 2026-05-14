import Heading from "@/components/heading";
import Placeholder from "@/components/placeholder";
import { Button } from "@/components/ui/button";
import { initialTickets } from "@/data";
import { homePath } from "@/path";
import Link from "next/link";

type TicketPageProps = {
  params: Promise<{ ticketId: string }>;
};

const TicketPage = async ({ params }: TicketPageProps) => {
  const { ticketId } = await params;

  const ticket = initialTickets.find((ticket) => ticket.id === ticketId);
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
    <div className="flex flex-col flex-1 gap-y-8">
      <Heading
        title="Ticket Details"
        description="Details of the selected ticket."
      />
      <h1>{ticket?.title}</h1>
      <p>{ticket?.content}</p>
      <span>Status: {ticket?.status}</span>
    </div>
  );
};

export default TicketPage;
