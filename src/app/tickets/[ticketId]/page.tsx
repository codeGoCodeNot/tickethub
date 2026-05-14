import Heading from "@/components/heading";
import Placeholder from "@/components/placeholder";
import Spinner from "@/components/spinner";
import { Button } from "@/components/ui/button";
import TicketDetail from "@/features/ticket/components/ticket-detail";
import TicketItem from "@/features/ticket/components/ticket-item";
import getTicket from "@/features/ticket/queries/get-ticket";
import { homePath } from "@/path";
import Link from "next/link";
import { Suspense } from "react";

type TicketPageProps = {
  params: Promise<{ ticketId: string }>;
};

const TicketPage = async ({ params }: TicketPageProps) => {
  const { ticketId } = await params;

  return (
    <div className="flex flex-col flex-1 gap-y-8">
      <Heading
        title="Ticket Details"
        description="Details of the selected ticket."
      />
      <Suspense fallback={<Spinner />}>
        <TicketDetail ticketId={ticketId} />
      </Suspense>
    </div>
  );
};

export default TicketPage;
