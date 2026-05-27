import OrgGuard from "@/features/organizations/components/org-guard";
import TicketPoller from "@/features/ticket/components/ticket-poller";
import { Suspense } from "react";

const TicketsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense>
      <OrgGuard>
        <TicketPoller />
        {children}
      </OrgGuard>
    </Suspense>
  );
};

export default TicketsLayout;
