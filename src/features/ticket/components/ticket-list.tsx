import Placeholder from "@/components/placeholder";
import { connection } from "next/server";
import getTickets from "../queries/get-tickets";
import TicketItem from "./ticket-item";
import SearchInput from "@/components/search-input";
import SortSelect from "@/components/sort-select";
import TicketPagination from "./ticket-pagination";

type TicketListProps = {
  userId?: string;
  search?: string;
  sort?: string;
  page?: number;
  size?: number;
};

const TicketList = async ({
  userId,
  search,
  sort,
  page,
  size,
}: TicketListProps) => {
  await connection();
  const { list: tickets, metadata: ticketMetadata } = await getTickets(
    userId,
    search,
    sort,
    page,
    size,
  );

  return (
    <div className="flex flex-col flex-1 items-center gap-y-4 animate-fade-from-top">
      <div className="w-full max-w-[500px] flex gap-x-2">
        <SearchInput placeholder="Search tickets..." />
        <SortSelect
          options={[
            { label: "Newest", value: "newest" },
            { label: "Oldest", value: "oldest" },
            { label: "Bounty", value: "bounty" },
            { label: "Deadline", value: "deadline" },
          ]}
        />
      </div>
      {tickets.length ? (
        tickets.map((ticket) => <TicketItem key={ticket.id} ticket={ticket} />)
      ) : (
        <Placeholder label="No tickets found" icon={null} />
      )}
      <div className="w-full max-w-[500px]">
        <TicketPagination paginatedTicketMetadata={ticketMetadata} />
      </div>
    </div>
  );
};

export default TicketList;
