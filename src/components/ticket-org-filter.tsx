"use client";

import { orgOnlyParser } from "@/features/ticket/search-params";
import { useQueryState } from "nuqs";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { useActiveOrganization } from "@/lib/auth-client";

const TicketOrgFilter = () => {
  const [orgOnly, setOrgOnly] = useQueryState("orgOnly", orgOnlyParser);
  const { data: activeOrg } = useActiveOrganization();

  return (
    <div className="flex flex-col items-center">
      <Tabs
        value={orgOnly ? "Organization" : "all"}
        onValueChange={(value) => setOrgOnly(value === "Organization")}
      >
        <TabsList>
          <TabsTrigger value="all">All My Tickets</TabsTrigger>
          <TabsTrigger value="Organization">
            {activeOrg?.name ?? "Active Organization"}
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default TicketOrgFilter;
