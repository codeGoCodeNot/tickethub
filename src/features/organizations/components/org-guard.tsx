import { getAuth } from "@/features/auth/queries/get-auth";
import getOrganizationsByUser from "../queries/get-organizations-by-user";
import { organizationPath, selectOrganizationPath } from "@/path";
import { redirect } from "next/navigation";
import getActiveOrganization from "../queries/get-active-organization";

const OrgGuard = async ({ children }: { children: React.ReactNode }) => {
  const user = await getAuth();
  const organizations = await getOrganizationsByUser(user?.id);
  const organizationId = await getActiveOrganization();
  if (organizations.length === 0) redirect(organizationPath());

  if (!organizationId) redirect(selectOrganizationPath());
  return <>{children}</>;
};

export default OrgGuard;
