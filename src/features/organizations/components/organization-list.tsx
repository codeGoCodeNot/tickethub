import { getAuth } from "@/features/auth/queries/get-auth";
import getOrganizationsByUser from "../queries/get-organizations-by-user";
import { format } from "date-fns/format";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { LucideArrowLeftRight } from "lucide-react";

const OrganizationList = async () => {
  const user = await getAuth();
  const organizations = await getOrganizationsByUser(user?.id);

  return (
    <div className="flex flex-col flex-1 px-8 gap-y-2">
      <Table>
        <TableCaption>A list of your organizations</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Id</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Joined At</TableHead>
            <TableHead>Members</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {organizations.map((organization) => (
            <TableRow key={organization.id}>
              <TableCell>{organization.id}</TableCell>
              <TableCell>{organization.name}</TableCell>
              <TableCell>
                {format(
                  new Date(organization.membershipByUser.createdAt),
                  "MMM d, yyyy",
                )}
              </TableCell>
              <TableCell>{organization._count.members}</TableCell>
              <TableCell>
                <Button size="icon">
                  <LucideArrowLeftRight />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default OrganizationList;
