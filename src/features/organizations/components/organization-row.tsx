"use client";

import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { organization, useActiveOrganization } from "@/lib/auth-client";
import { motion } from "framer-motion";
import { LucideArrowLeftRight, LucideLoaderCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const MotionTableRow = motion(TableRow);

type OrganizationRowProps = {
  id: string;
  name: string;
  joinedAt: string;
  members: number;
};

const OrganizationRow = ({
  id,
  name,
  joinedAt,
  members,
}: OrganizationRowProps) => {
  const { data: activeOrg } = useActiveOrganization();
  const [isPending, setIsPending] = useState(false);
  const isActive = activeOrg?.id === id;

  return (
    <MotionTableRow
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <TableCell>{id}</TableCell>
      <TableCell>{name}</TableCell>
      <TableCell>{joinedAt}</TableCell>
      <TableCell>{members}</TableCell>
      <TableCell className="relative z-[10]">
        <Button
          size="icon"
          variant={isActive ? "default" : "outline"}
          disabled={isActive}
          onClick={async () => {
            setIsPending(true);
            await organization.setActive({ organizationId: id });
            toast.success(`Switched to ${name}`);
            setIsPending(false);
          }}
        >
          {isPending ? (
            <LucideLoaderCircle className="animate-spin" />
          ) : (
            <LucideArrowLeftRight />
          )}
        </Button>
      </TableCell>
    </MotionTableRow>
  );
};

export default OrganizationRow;
