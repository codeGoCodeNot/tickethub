import Heading from "@/components/heading";
import Spinner from "@/components/spinner";
import { Separator } from "@/components/ui/separator";
import TicketList from "@/features/ticket/components/ticket-list";
import { Suspense } from "react";

const HomePage = () => {
  return (
    <div className="flex flex-col flex-1 gap-y-8">
      <Heading
        title="All tickets in one place"
        description="Tickets by everyone at one place"
      />
      <Suspense fallback={<Spinner />}>
        <TicketList />
      </Suspense>
    </div>
  );
};

export default HomePage;
