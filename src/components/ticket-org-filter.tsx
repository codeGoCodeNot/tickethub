"use client";

import { orgOnlyParser } from "@/features/ticket/search-params";
import { useQueryState } from "nuqs";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { useActiveOrganization } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const TicketOrgFilter = () => {
  const [orgOnly, setOrgOnly] = useQueryState("orgOnly", orgOnlyParser);
  const { data: activeOrg } = useActiveOrganization();
  const router = useRouter();

  return (
    <div className="flex flex-col items-center">
      <Tabs
        value={orgOnly ? "Organization" : "all"}
        onValueChange={async (value) => {
          await setOrgOnly(value === "Organization");
          router.refresh();
        }}
      >
        <TabsList>
          <TabsTrigger value="all">All My Tickets</TabsTrigger>
          <TabsTrigger value="Organization">
            <span suppressHydrationWarning>
              {activeOrg?.name ?? "Active Organization"}
            </span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default TicketOrgFilter;
