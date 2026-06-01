import AccountGuard from "@/features/organizations/components/org-guard";
import { Suspense } from "react";

const TicketsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense>
      <AccountGuard>{children}</AccountGuard>
    </Suspense>
  );
};

export default TicketsLayout;
