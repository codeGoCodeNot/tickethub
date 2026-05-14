import { notFound } from "next/navigation";
import getTicket from "../queries/get-ticket";
import TicketItem from "./ticket-item";

type TicketDetailProps = {
  id: string;
};

const TicketDetail = async ({ id }: TicketDetailProps) => {
  const ticket = await getTicket(id);

  if (!ticket) return notFound();

  return (
    <div className="flex flex-col flex-1 items-center gap-y-4 animate-fade-from-top">
      <TicketItem ticket={ticket} isDetail />
    </div>
  );
};

export default TicketDetail;
