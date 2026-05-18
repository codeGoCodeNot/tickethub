import Breadcrumbs from "@/components/breadcrumbs";
import CardCompact from "@/components/card-compact";
import Heading from "@/components/heading";
import Spinner from "@/components/spinner";
import { getAuth } from "@/features/auth/queries/get-auth";
import TicketList from "@/features/ticket/components/ticket-list";
import TicketUpsertForm from "@/features/ticket/components/ticket-upsert-form";
import { homePath } from "@/path";
import { connection } from "next/server";
import { Suspense } from "react";

type AuthenticatedTicketListProps = {
  searchParams: Promise<{ search: string }>;
};

const AuthenticatedTicketList = async ({
  searchParams,
}: AuthenticatedTicketListProps) => {
  await connection();
  const user = await getAuth();
  const { search } = await searchParams;
  return <TicketList userId={user?.id} search={search} />;
};

type TicketsPageProps = {
  searchParams: Promise<{ search: string }>;
};

const TicketsPage = ({ searchParams }: TicketsPageProps) => {
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
