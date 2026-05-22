import { getAuth } from "@/features/auth/queries/get-auth";
import getOrganizationsByUser from "../queries/get-organizations-by-user";
import { format } from "date-fns/format";

const OrganizationList = async () => {
  const user = await getAuth();
  const organizations = await getOrganizationsByUser(user?.id);

  return (
    <div className="flex flex-col flex-1 px-8 gap-y-2">
      {organizations.map((organization) => (
        <div key={organization.id} className="p-4 border rounded-md">
          <div className="text-lg">Name: {organization.name}</div>
          <div>
            Joined At:{" "}
            {format(
              new Date(organization.membershipByUser.createdAt),
              "MMM d, yyyy",
            )}
          </div>
          <div>Members: {organization._count.members}</div>
        </div>
      ))}
    </div>
  );
};

export default OrganizationList;
