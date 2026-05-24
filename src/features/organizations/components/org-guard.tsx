import { getAuth } from "@/features/auth/queries/get-auth";
import getOrganizationsByUser from "../queries/get-organizations-by-user";
import { organizationPath } from "@/path";
import { redirect } from "next/navigation";

const OrgGuard = async ({ children }: { children: React.ReactNode }) => {
  const user = await getAuth();
  const organizations = await getOrganizationsByUser(user?.id);
  if (organizations.length === 0) {
    redirect(organizationPath());
  }
  return <>{children}</>;
};

export default OrgGuard;
