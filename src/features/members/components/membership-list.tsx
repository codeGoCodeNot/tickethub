import {
  Table,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Placeholder from "@/components/placeholder";
import { format } from "date-fns/format";
import getMemberships from "../queries/get-memberhips";
import MembershipCards from "./membership-cards";
import MembershipTable from "./membership-table";

type MembershipListProps = {
  organizationId: string;
};

const MembershipList = async ({ organizationId }: MembershipListProps) => {
  const memberships = await getMemberships(organizationId);

  const mapped = memberships.map((membership) => ({
    id: membership.id,
    name: membership.user.name,
    email: membership.user.email,
    emailVerified: membership.user.emailVerified,
    joinedAt: format(new Date(membership.createdAt), "MMM d, yyyy"),
    role: membership.role,
  }));

  if (!memberships.length) {
    return <Placeholder label="No members found" icon={null} />;
  }

  return (
    <div className="flex flex-col flex-1 px-8 gap-y-2">
      {/* Desktop table */}
      <Table className="hidden md:table">
        <TableCaption>A list of organization members</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Joined At</TableHead>
            <TableHead>Verified</TableHead>
          </TableRow>
        </TableHeader>
        <MembershipTable memberships={mapped} />
      </Table>

      {/* Mobile cards */}
      <div className="md:hidden">
        <MembershipCards memberships={mapped} />
      </div>
    </div>
  );
};

export default MembershipList;
