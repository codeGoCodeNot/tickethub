import Heading from "@/components/heading";
import Placeholder from "@/components/placeholder";
import { getAuth } from "@/features/auth/queries/get-auth";
import isOwnerOrAdmin from "@/features/auth/utils/is-owner-or-admin";
import getActiveOrganization from "@/features/organizations/queries/get-active-organization";
import TicketApprovalItem from "@/features/ticket/components/ticket-approval-item";
import getPendingTickets from "@/features/ticket/queries/get-pending-tickets";
import { organizationPath } from "@/path";
import { forbidden, redirect } from "next/navigation";

const TicketApprovalsPage = async () => {
  const organizationId = await getActiveOrganization();
  const user = await getAuth();

  if (!organizationId) redirect(organizationPath());

  if (!(await isOwnerOrAdmin(user?.id, organizationId))) forbidden();

  const pendingTickets = await getPendingTickets(organizationId);

  return (
    <div className="flex flex-col flex-1 gap-y-8">
      <Heading
        title="Ticket Approvals"
        description="Review and approve pending tickets from members"
      />

      {pendingTickets.length ? (
        pendingTickets.map((ticket) => (
          <TicketApprovalItem key={ticket.id} ticket={ticket} />
        ))
      ) : (
        <Placeholder label="No pending tickets" icon={null} />
      )}
    </div>
  );
};

export default TicketApprovalsPage;
