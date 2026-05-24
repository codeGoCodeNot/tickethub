import {
  Table,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAuth } from "@/features/auth/queries/get-auth";
import { format } from "date-fns/format";
import getOrganizationsByUser from "../queries/get-organizations-by-user";
import OrganizationCards from "./organization-cards";
import OrganizationTable from "./organization-table";

const OrganizationList = async () => {
  const user = await getAuth();
  const organizations = await getOrganizationsByUser(user?.id);

  const mapped = organizations.map((org) => ({
    id: org.id,
    name: org.name,
    joinedAt: format(new Date(org.membershipByUser.createdAt), "MMM d, yyyy"),
    members: org._count.members,
  }));

  return (
    <div className="flex flex-col flex-1 px-8 gap-y-2">
      {/* Desktop table */}
      <Table className="hidden md:table">
        <TableCaption>A list of your organizations</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Joined At</TableHead>
            <TableHead>Members</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <OrganizationTable organizations={mapped} />
      </Table>

      {/* Mobile cards */}
      <div className="md:hidden">
        <OrganizationCards organizations={mapped} />
      </div>
    </div>
  );
};

export default OrganizationList;
