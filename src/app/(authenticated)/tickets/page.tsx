import Breadcrumbs from "@/components/breadcrumbs";
import CardCompact from "@/components/card-compact";
import Heading from "@/components/heading";
import Spinner from "@/components/spinner";
import { getAuth } from "@/features/auth/queries/get-auth";
import TicketList from "@/features/ticket/components/ticket-list";
import TicketUpsertForm from "@/features/ticket/components/ticket-upsert-form";
import { searchParamsCache } from "@/features/ticket/search-params";
import { homePath } from "@/path";
import { connection } from "next/server";
import { SearchParams } from "nuqs/server";
import { Suspense } from "react";

type AuthenticatedTicketListProps = {
  searchParams: Promise<SearchParams>;
};

const AuthenticatedTicketList = async ({
  searchParams,
}: AuthenticatedTicketListProps) => {
  await connection();
  const user = await getAuth();
  const { search, sort, page, size } = searchParamsCache.parse(
    await searchParams,
  );
  return (
    <TicketList
      userId={user?.id}
      search={search}
      sort={sort}
      page={page}
      size={size}
    />
  );
};

const TicketsPage = ({ searchParams }: AuthenticatedTicketListProps) => {
  return (
    <div className="flex flex-col flex-1 gap-y-8">
      <Heading
        title="My tickets"
        description="All your tickets in one place"
        breadcrumbs={
          <Breadcrumbs
            breadcrumbs={[
              { title: "Home", href: homePath() },
              { title: "My Tickets" },
            ]}
          />
        }
      />

      <CardCompact
        title="Create Ticket"
        description="Fill out the form below to create a new ticket."
        content={<TicketUpsertForm />}
      />

      <Suspense fallback={<Spinner />}>
        <AuthenticatedTicketList searchParams={searchParams} />
      </Suspense>
    </div>
  );
};

export default TicketsPage;
