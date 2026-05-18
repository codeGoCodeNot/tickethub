import Placeholder from "@/components/placeholder";
import { connection } from "next/server";
import getTickets from "../queries/get-tickets";
import TicketItem from "./ticket-item";
import SearchInput from "@/components/search-input";
import SortSelect from "@/components/sort-select";

type TicketListProps = {
  userId?: string;
  search?: string;
  sort?: string;
};

const TicketList = async ({ userId, search, sort }: TicketListProps) => {
  await connection();
  const tickets = await getTickets(userId, search, sort);

  return (
    <div className="flex flex-col flex-1 items-center gap-y-4 animate-fade-from-top">
      <div className="w-full max-w-[500px] flex gap-x-2">
        <SearchInput placeholder="Search tickets..." />
        <SortSelect
          defaultValue="newest"
          options={[
            { label: "Newest", value: "newest" },
            { label: "Bounty", value: "bounty" },
          ]}
        />
      </div>
      {tickets.length ? (
        tickets.map((ticket) => <TicketItem key={ticket.id} ticket={ticket} />)
      ) : (
        <Placeholder label="No tickets found" icon={null} />
      )}
    </div>
  );
};

export default TicketList;
