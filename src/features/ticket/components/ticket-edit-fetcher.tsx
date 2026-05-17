import CardCompact from "@/components/card-compact";
import { forbidden, notFound } from "next/navigation";
import getTicket from "../queries/get-ticket";
import TicketUpsertForm from "./ticket-upsert-form";
import isOwner from "@/features/auth/utils/is-owner";
import { getAuth } from "@/features/auth/queries/get-auth";

type TicketEditPageProps = {
  params: Promise<{ ticketId: string }>;
};

const TicketEditFetcher = async ({ params }: TicketEditPageProps) => {
  const { ticketId } = await params;
  const ticket = await getTicket(ticketId);
  const user = await getAuth();

  if (!ticket) return notFound();

  const isTicketOwner = isOwner(user, ticket);

  if (!isTicketOwner) return forbidden();

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

export default TicketEditFetcher;
