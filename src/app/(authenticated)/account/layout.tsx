import OrgGuard from "@/features/organizations/components/org-guard";
import { Suspense } from "react";

const AccountLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense>
      <OrgGuard>{children}</OrgGuard>
    </Suspense>
  );
};

export default AccountLayout;
