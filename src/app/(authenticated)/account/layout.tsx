import { organizationPath } from "@/path";
import getSession from "@/lib/get-session";
import { redirect } from "next/navigation";
import { Suspense } from "react";

const OrgGuard = async ({ children }: { children: React.ReactNode }) => {
  const session = await getSession();
  if (!session?.session.activeOrganizationId) {
    redirect(organizationPath());
  }
  return <>{children}</>;
};

const AccountLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense>
      <OrgGuard>{children}</OrgGuard>
    </Suspense>
  );
};

export default AccountLayout;
