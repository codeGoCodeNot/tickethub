import Placeholder from "@/components/placeholder";
import { connection } from "next/server";
import getTickets from "../queries/get-tickets";
import TicketItem from "./ticket-item";
import SearchInput from "@/components/search-input";

type TicketListProps = {
  userId?: string;
  search?: string;
};

const TicketList = async ({ userId, search }: TicketListProps) => {
  await connection();
  const tickets = await getTickets(userId, search);

  return (
    <div className="flex flex-col flex-1 items-center gap-y-4 animate-fade-from-top">
      <div className="w-full max-w-[500px]">
        <SearchInput placeholder="Search tickets..." />
      </div>
      {tickets.length ? (
        tickets.map((ticket) => (
          <TicketItem key={ticket.id} ticket={ticket} />
        ))
      ) : (
        <Placeholder label="No tickets found" icon={null} />
      )}
    </div>
  );
};

export default TicketList;
