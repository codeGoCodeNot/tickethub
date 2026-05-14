import Placeholder from "@/components/placeholder";
import { Button } from "@/components/ui/button";
import { homePath } from "@/path";
import Link from "next/link";
import getTicket from "../queries/get-ticket";
import TicketItem from "./ticket-item";
import { notFound } from "next/navigation";

type TicketDetailProps = {
  ticketId: string;
};

const TicketDetail = async ({ ticketId }: TicketDetailProps) => {
  const ticket = await getTicket(ticketId);

  if (!ticket) return notFound();

  return (
    <div className="flex flex-col flex-1 items-center gap-y-4 animate-fade-from-top">
      <TicketItem ticket={ticket} isDetail />
    </div>
  );
};

export default TicketDetail;
