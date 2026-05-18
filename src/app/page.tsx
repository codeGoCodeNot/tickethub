import Heading from "@/components/heading";
import Spinner from "@/components/spinner";
import TicketList from "@/features/ticket/components/ticket-list";
import { Suspense } from "react";

type HomePageProps = {
  searchParams: Promise<{ search: string }>;
};

const TicketListWrapper = async ({ searchParams }: HomePageProps) => {
  const { search } = await searchParams;
  return <TicketList search={search} />;
};

const HomePage = ({ searchParams }: HomePageProps) => {
  return (
    <div className="flex flex-col flex-1 gap-y-8">
      <Heading
        title="All tickets in one place"
        description="Tickets by everyone at one place"
      />
      <Suspense fallback={<Spinner />}>
        <TicketListWrapper searchParams={searchParams} />
      </Suspense>
    </div>
  );
};

export default HomePage;
