import Breadcrumbs from "@/components/breadcrumbs";
import CardCompact from "@/components/card-compact";
import Heading from "@/components/heading";
import Spinner from "@/components/spinner";
import TicketOrgFilter from "@/components/ticket-org-filter";
import { getAuth } from "@/features/auth/queries/get-auth";
import isOwnerOrAdmin from "@/features/auth/utils/is-owner-or-admin";
import getActiveOrganization from "@/features/organizations/queries/get-active-organization";
import TicketList from "@/features/ticket/components/ticket-list";
import TicketUpsertForm from "@/features/ticket/components/ticket-upsert-form";
import { searchParamsCache } from "@/features/ticket/search-params";
import { homePath } from "@/path";
import { connection } from "next/server";
import { SearchParams } from "nuqs/server";
import { Suspense } from "react";

type AuthenticatedTicketListProps = {
  searchParams: Promise<SearchParams>;
  orgOnly: boolean;
  organizationId?: string;
};

const AuthenticatedTicketList = async ({
  searchParams,
  orgOnly,
  organizationId,
}: AuthenticatedTicketListProps) => {
  await connection();
  const user = await getAuth();
  const { search, sort, page, size } = searchParamsCache.parse(
    await searchParams,
  );
  const adminOrOwner = organizationId
    ? await isOwnerOrAdmin(user?.id, organizationId)
    : false;
  return (
    <TicketList
      userId={user?.id}
      organizationId={orgOnly ? organizationId : undefined}
      search={search}
      sort={sort}
      page={page}
      size={size}
      isOwnerOrAdmin={adminOrOwner}
    />
  );
};

type TicketsPageProps = {
  searchParams: Promise<SearchParams>;
};

const TicketsPage = async ({ searchParams }: TicketsPageProps) => {
  const { orgOnly } = searchParamsCache.parse(await searchParams);
  const organizationId = await getActiveOrganization();

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

      <TicketOrgFilter />

      <Suspense key={`${orgOnly}-${organizationId}`} fallback={<Spinner />}>
        <AuthenticatedTicketList
          searchParams={searchParams}
          orgOnly={orgOnly}
          organizationId={organizationId ?? undefined}
        />
      </Suspense>
    </div>
  );
};

export default TicketsPage;
