import CardCompact from "@/components/card-compact";
import Heading from "@/components/heading";
import Spinner from "@/components/spinner";
import TicketCreateForm from "@/features/ticket/components/ticket-create-form";
import TicketList from "@/features/ticket/components/ticket-list";
import { Suspense } from "react";

const TicketsPage = () => {
  return (
    <div className="flex flex-col flex-1 gap-y-8">
      <Heading
        title="Tickets Page"
        description="All your tickets in one place."
      />

      <CardCompact
        title="Create Ticket"
        description="Fill out the form below to create a new ticket."
        content={<TicketCreateForm />}
      />

      <Suspense fallback={<Spinner />}>
        <TicketList />
      </Suspense>
    </div>
  );
};

export default TicketsPage;
