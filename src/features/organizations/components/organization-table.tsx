"use client";

import { TableBody } from "@/components/ui/table";
import { useActiveOrganization } from "@/lib/auth-client";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import OrganizationRow from "./organization-row";

type OrganizationTableProps = {
  organizations: {
    id: string;
    name: string;
    joinedAt: string;
    members: number;
  }[];
  limitedAccess?: boolean;
};

const OrganizationTable = ({
  organizations,
  limitedAccess,
}: OrganizationTableProps) => {
  const { data: activeOrg } = useActiveOrganization();
  const [optimisticActiveId, setOptimisticActiveId] = useState<string | null>(
    null,
  );
  const effectiveActiveId = optimisticActiveId ?? activeOrg?.id;

  return (
    <TableBody>
      {organizations.map((org) => (
        <OrganizationRow
          key={org.id}
          id={org.id}
          name={org.name}
          joinedAt={org.joinedAt}
          members={org.members}
          isActive={effectiveActiveId === org.id}
          onSwitch={() => setOptimisticActiveId(org.id)}
          limitedAccess={limitedAccess}
        />
      ))}
    </TableBody>
  );
};

export default OrganizationTable;
