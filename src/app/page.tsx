import Heading from "@/components/heading";
import Spinner from "@/components/spinner";
import SuspenseWithKey from "@/components/suspense-with-key";
import TicketList from "@/features/ticket/components/ticket-list";
import { searchParamsCache } from "@/features/ticket/search-params";
import { SearchParams } from "nuqs/server";
import { Suspense } from "react";

type HomePageProps = {
  searchParams: Promise<SearchParams>;
};

const TicketListWrapper = async ({ searchParams }: HomePageProps) => {
  const { search, sort, page, size } = searchParamsCache.parse(
    await searchParams,
  );
  return <TicketList search={search} sort={sort} page={page} size={size} />;
};

const HomePage = ({ searchParams }: HomePageProps) => {
  return (
    <div className="flex flex-col flex-1 gap-y-8">
      <Heading
        title="All tickets in one place"
        description="Tickets by everyone at one place"
      />
      <Suspense fallback={<Spinner />}>
        <SuspenseWithKey fallback={<Spinner />}>
          <TicketListWrapper searchParams={searchParams} />
        </SuspenseWithKey>
      </Suspense>
    </div>
  );
};

export default HomePage;
