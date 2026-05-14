import Placeholder from "@/components/placeholder";
import getTickets from "../queries/get-tickets";
import TicketItem from "./ticket-item";

const TicketList = async () => {
  const tickets = await getTickets();

  if (!tickets.length)
    return <Placeholder label="No tickets found" icon={null} />;

  return (
    <div className="flex flex-col flex-1 items-center gap-y-4 animate-fade-from-top">
      {tickets.map((ticket) => (
        <TicketItem key={ticket.id} ticket={ticket} />
      ))}
    </div>
  );
};

export default TicketList;
