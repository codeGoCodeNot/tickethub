import Breadcrumbs from "@/components/breadcrumbs";
import Heading from "@/components/heading";
import Spinner from "@/components/spinner";
import { getAuth } from "@/features/auth/queries/get-auth";
import Comments from "@/features/comment/components/comments";
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
  const ticket = await getTicket(ticketId);

  const user = await getAuth();

  if (!ticket) return notFound();

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
              { title: ticket.title },
            ]}
          />
        }
      />
      <div className="flex flex-col flex-1 items-center animate-fade-from-top">
        <TicketItem
          ticket={ticket}
          isDetail
          comments={
            <Comments
              ticketId={ticketId}
              user={user ? { ...user, image: user.image ?? null } : null}
            />
          }
        />
      </div>
    </div>
  );
};

const TicketPage = ({ params }: TicketPageProps) => {
  return (
    <div className="flex flex-col flex-1 gap-y-8">
      <Suspense fallback={<Spinner />}>
        <TicketDetail params={params} />
      </Suspense>
    </div>
  );
};

export default TicketPage;
