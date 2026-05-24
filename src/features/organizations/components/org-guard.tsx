import { getAuth } from "@/features/auth/queries/get-auth";
import getOrganizationsByUser from "../queries/get-organizations-by-user";
import { organizationPath, selectOrganizationPath } from "@/path";
import { redirect } from "next/navigation";
import getSession from "@/lib/get-session";

const OrgGuard = async ({ children }: { children: React.ReactNode }) => {
  const user = await getAuth();
  const organizations = await getOrganizationsByUser(user?.id);
  const session = await getSession();
  if (organizations.length === 0) redirect(organizationPath());

  if (!session?.session.activeOrganizationId)
    redirect(selectOrganizationPath());
  return <>{children}</>;
};

export default OrgGuard;
