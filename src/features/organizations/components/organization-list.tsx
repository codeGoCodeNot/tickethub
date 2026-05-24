import { getAuth } from "@/features/auth/queries/get-auth";
import getOrganizationsByUser from "../queries/get-organizations-by-user";
import { format } from "date-fns/format";
import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Placeholder from "@/components/placeholder";
import OrganizationRow from "./organization-row";

const OrganizationList = async () => {
  const user = await getAuth();
  const organizations = await getOrganizationsByUser(user?.id);

  return (
    <div className="flex flex-col flex-1 px-8 gap-y-2">
      <Table>
        {!organizations ? (
          <TableCaption>A list of your organizations</TableCaption>
        ) : (
          <>
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
            <TableBody>
              {organizations.map((organization) => (
                <OrganizationRow
                  key={organization.id}
                  id={organization.id}
                  name={organization.name}
                  joinedAt={format(
                    new Date(organization.membershipByUser.createdAt),
                    "MMM d, yyyy",
                  )}
                  members={organization._count.members}
                />
              ))}
            </TableBody>
          </>
        )}
      </Table>
    </div>
  );
};

export default OrganizationList;
