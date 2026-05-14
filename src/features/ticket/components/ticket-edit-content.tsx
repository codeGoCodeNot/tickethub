import CardCompact from "@/components/card-compact";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import getTicket from "../queries/get-ticket";
import TicketUpsertForm from "./ticket-upsert-form";

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
          <TicketUpsertForm ticket={ticket} key={ticket.updatedAt.toString()} />
        }
      />
    </div>
  );
};

export default TicketEditContent;
