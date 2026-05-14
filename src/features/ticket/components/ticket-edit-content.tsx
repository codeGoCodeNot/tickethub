import CardCompact from "@/components/card-compact";
import { notFound } from "next/navigation";
import getTicket from "../queries/get-ticket";
import TicketEditForm from "./ticket-edit-form";
import { connection } from "next/server";

type TicketEditPageProps = {
  params: Promise<{ ticketId: string }>;
};

const TicketEditContent = async ({ params }: TicketEditPageProps) => {
  await connection();
  const { ticketId } = await params;
  const ticket = await getTicket(ticketId);

  if (!ticket) return notFound();

  return (
    <div className="flex flex-col flex-1 items-center">
      <CardCompact
        title="Edit Ticket"
        description="Edit an existing ticket."
        content={
          <TicketEditForm key={ticket.updatedAt.toString()} ticket={ticket} />
        }
      />
    </div>
  );
};

export default TicketEditContent;
