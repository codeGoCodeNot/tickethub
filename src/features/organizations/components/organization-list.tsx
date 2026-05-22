import { getAuth } from "@/features/auth/queries/get-auth";
import getOrganizationsByUser from "../queries/get-organizations-by-user";

const OrganizationList = async () => {
  const user = await getAuth();
  const organizations = await getOrganizationsByUser(user?.id);

  return (
    <div className="flex flex-col flex-1 px-8">
      {organizations.map((org) => (
        <div key={org.id}>
          <h3 className="text-lg">Name: {org.name}</h3>
        </div>
      ))}
    </div>
  );
};

export default OrganizationList;
