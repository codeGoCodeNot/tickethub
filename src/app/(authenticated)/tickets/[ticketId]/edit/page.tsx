import Breadcrumbs from "@/components/breadcrumbs";
import CardCompact from "@/components/card-compact";
import Heading from "@/components/heading";
import Spinner from "@/components/spinner";
import { getAuth } from "@/features/auth/queries/get-auth";
import isOwner from "@/features/auth/utils/is-owner";
import getActiveOrganization from "@/features/organizations/queries/get-active-organization";
import getStripeProvisioning from "@/features/stripe/queries/get-stripe-provisioning";
import TicketUpsertForm from "@/features/ticket/components/ticket-upsert-form";
import getTicket from "@/features/ticket/queries/get-ticket";
import { homePath, ticketPath, ticketsPath } from "@/path";
import { forbidden, notFound } from "next/navigation";

import { Suspense } from "react";

type TicketEditPageProps = {
  params: Promise<{ ticketId: string }>;
};

const TicketEditFetcher = async ({ params }: TicketEditPageProps) => {
  const { ticketId } = await params;
  const organizationId = await getActiveOrganization();
  const ticket = await getTicket(ticketId, organizationId ?? undefined);
  const user = await getAuth();

  if (!ticket) return notFound();

  const isTicketOwner = isOwner(user, ticket);

  // private ticket
  const { hasActivePlan } = await getStripeProvisioning(organizationId);

  if (!isTicketOwner) return forbidden();

  return (
    <div className="flex flex-col flex-1 items-center animate-fade-from-top">
      <CardCompact
        title="Edit Ticket"
        description="Edit an existing ticket."
        content={
          <TicketUpsertForm
            ticket={ticket}
            key={ticket.updatedAt.toString()}
            hasActivePlan={hasActivePlan}
          />
        }
      />
    </div>
  );
};

const TicketEditPage = ({ params }: TicketEditPageProps) => {
  return (
    <div className="flex flex-col flex-1 gap-y-8">
      <Heading
        title="Edit Ticket"
        description="Modify the details of your ticket."
        breadcrumbs={
          <Breadcrumbs
            breadcrumbs={[
              { title: "Home", href: homePath() },
              { title: "Tickets", href: ticketsPath() },
              // { title: "Edit Ticket", href: ticketPath(ticket.id) },
              { title: "Edit" },
            ]}
          />
        }
      />
      <Suspense fallback={<Spinner />}>
        <TicketEditFetcher params={params} />
      </Suspense>
    </div>
  );
};

export default TicketEditPage;
