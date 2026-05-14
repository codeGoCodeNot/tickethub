import Heading from "@/components/heading";
import Spinner from "@/components/spinner";
import TicketEditFetcher from "@/features/ticket/components/ticket-edit-fetcher";
import { Suspense } from "react";

type TicketEditPageProps = {
  params: Promise<{ ticketId: string }>;
};

const TicketEditPage = ({ params }: TicketEditPageProps) => {
  return (
    <div className="flex flex-col flex-1 gap-y-8">
      <Heading
        title="Edit Ticket"
        description="Modify the details of your ticket."
      />
      <Suspense fallback={<Spinner />}>
        <TicketEditFetcher params={params} />
      </Suspense>
    </div>
  );
};

export default TicketEditPage;
