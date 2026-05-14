import { notFound } from "next/navigation";
import getTicket from "../queries/get-ticket";
import TicketItem from "./ticket-item";

type TicketDetailProps = {
  params: Promise<{ ticketId: string }>;
};

const TicketDetail = async ({ params }: TicketDetailProps) => {
  const { ticketId } = await params;
  const ticket = await getTicket(ticketId);

  if (!ticket) return notFound();

  return (
    <div className="flex flex-col flex-1 items-center animate-fade-from-top">
      <TicketItem ticket={ticket} isDetail />
    </div>
  );
};

export default TicketDetail;
