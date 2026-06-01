import Heading from "@/components/heading";
import Spinner from "@/components/spinner";
import TicketList from "@/features/ticket/components/ticket-list";
import TicketPoller from "@/features/ticket/components/ticket-poller";
import getActiveOrganization from "@/features/organizations/queries/get-active-organization";
import { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import { searchParamsCache } from "@/features/ticket/search-params";
import TicketUpsertForm from "@/features/ticket/components/ticket-upsert-form";
import CardCompact from "@/components/card-compact";
import { getAuth } from "@/features/auth/queries/get-auth";
import isOwnerOrAdmin from "@/features/auth/utils/is-owner-or-admin";

type TicketsByOrganizationPageProps = {
  searchParams: Promise<SearchParams>;
};

const TicketsByOrganizationPage = async ({
  searchParams,
}: TicketsByOrganizationPageProps) => {
  const params = await searchParams;
  const organizationId = await getActiveOrganization();
  const { search, sort, page, size } = searchParamsCache.parse(params);
  const user = await getAuth();
  const adminOrOwner = organizationId
    ? await isOwnerOrAdmin(user?.id, organizationId)
    : false;

  return (
    <div className="flex flex-col flex-1 gap-y-8">
      <TicketPoller />
      <Heading
        title="Our tickets"
        description="All tickets related to organization"
      />

      <CardCompact
        title="Create Ticket"
        description="Fill out the form below to create a new ticket."
        content={<TicketUpsertForm />}
      />

      <Suspense fallback={<Spinner />}>
        <TicketList
          organizationId={organizationId}
          search={search}
          sort={sort}
          page={page}
          size={size}
          isOwnerOrAdmin={adminOrOwner}
        />
      </Suspense>
    </div>
  );
};

export default TicketsByOrganizationPage;
