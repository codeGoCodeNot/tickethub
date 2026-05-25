import Placeholder from "@/components/placeholder";
import getInvitations from "../queries/get-invitations";
import {
  Table,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import InvitationCards from "./invitation-cards";
import InvitationTable from "./invitation-table";

type InvitationListProps = {
  organizationId: string;
};

const InvitationList = async ({ organizationId }: InvitationListProps) => {
  const invitations = await getInvitations(organizationId);

  if (!invitations.length)
    return <Placeholder label="No invitations found" icon={null} />;

  const mapped = invitations.map((invitation) => ({
    id: invitation.id,
    organizationId: invitation.organizationId,
    email: invitation.email,
    role: invitation.role,
    status: invitation.status,
    createdAt: format(new Date(invitation.createdAt), "MMM d, yyyy"),
    expiresAt: format(new Date(invitation.expiresAt), "MMM d, yyyy"),
  }));

  return (
    <div className="flex flex-col gap-y-2 px-8">
      <Table className="hidden md:table">
        <TableCaption>Pending invitations</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Invited At</TableHead>
            <TableHead>Expires At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <InvitationTable invitations={mapped} />
      </Table>

      <div className="md:hidden">
        <InvitationCards invitations={mapped} />
      </div>
    </div>
  );
};

export default InvitationList;
