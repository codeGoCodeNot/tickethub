import Heading from "@/components/heading";
import Spinner from "@/components/spinner";
import TicketEditContent from "@/features/ticket/components/ticket-edit-content";
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
        <TicketEditContent params={params} />
      </Suspense>
    </div>
  );
};

export default TicketEditPage;
