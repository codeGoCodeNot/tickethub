import Breadcrumbs from "@/components/breadcrumbs";
import Heading from "@/components/heading";
import Spinner from "@/components/spinner";
import Attachments from "@/features/attachments/components/attachments";
import { getAuth } from "@/features/auth/queries/get-auth";
import isOwnerOrAdmin from "@/features/auth/utils/is-owner-or-admin";
import Comments from "@/features/comment/components/comments";
import getComments from "@/features/comment/queries/get-comments";
import TicketItem from "@/features/ticket/components/ticket-item";
import getTicket from "@/features/ticket/queries/get-ticket";
import { homePath, ticketsPath } from "@/path";
import { notFound } from "next/navigation";
import { Suspense } from "react";

type TicketPageProps = {
  params: Promise<{ ticketId: string }>;
};

const TicketDetail = async ({ params }: TicketPageProps) => {
  const { ticketId } = await params;
  const [ticket, user, comments] = await Promise.all([
    getTicket(ticketId),
    getAuth(),
    getComments(ticketId),
  ]);

  if (!ticket) return notFound();

  const isTicketOwner = ticket.userId === user?.id;
  const isOrgAdminOrOwner = await isOwnerOrAdmin(
    user?.id,
    ticket.organizationId,
  );

  return (
    <div className="flex flex-col flex-1 items-center animate-fade-from-top">
      <TicketItem
        ticket={ticket}
        isDetail
        isTicketOwner={isTicketOwner}
        isOrgAdminOrOwner={isOrgAdminOrOwner}
        attachments={
          <Attachments
            ticketId={ticketId}
            isOwner={ticket.userId === user?.id}
          />
        }
        comments={
          <Comments
            ticketId={ticketId}
            user={user ? { ...user, image: user.image ?? null } : null}
            initialComments={comments}
          />
        }
      />
    </div>
  );
};

const TicketPage = ({ params }: TicketPageProps) => {
  return (
    <div className="flex flex-col flex-1 gap-y-8">
      <Heading
        title="Ticket Details"
        description="Details of the selected ticket."
        breadcrumbs={
          <Breadcrumbs
            breadcrumbs={[
              { title: "Home", href: homePath() },
              { title: "Tickets", href: ticketsPath() },
              { title: "Ticket Details" },
            ]}
          />
        }
      />
      <Suspense fallback={<Spinner />}>
        <TicketDetail params={params} />
      </Suspense>
    </div>
  );
};

export default TicketPage;
