import Heading from "@/components/heading";
import Spinner from "@/components/spinner";
import TicketDetail from "@/features/ticket/components/ticket-detail";
import { Suspense } from "react";

type TicketPageProps = {
  params: Promise<{ ticketId: string }>;
};

const TicketPage = ({ params }: TicketPageProps) => {
  return (
    <div className="flex flex-col flex-1 gap-y-8">
      <Heading
        title="Ticket Details"
        description="Details of the selected ticket."
      />
      <Suspense fallback={<Spinner />}>
        <TicketDetail params={params} />
      </Suspense>
    </div>
  );
};

export default TicketPage;
