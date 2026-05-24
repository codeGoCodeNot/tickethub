"use client";

import { TableBody } from "@/components/ui/table";
import { AnimatePresence } from "framer-motion";
import MembershipRow from "./membership-row";

type MembershipTableProps = {
  memberships: {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    joinedAt: string;
    role: string;
    userId: string;
  }[];
  currentUserId?: string;
};

const MembershipTable = ({
  memberships,
  currentUserId,
}: MembershipTableProps) => {
  return (
    <TableBody>
      <AnimatePresence initial={false}>
        {memberships.map((membership) => (
          <MembershipRow
            key={membership.id}
            {...membership}
            currentUserId={currentUserId}
          />
        ))}
      </AnimatePresence>
    </TableBody>
  );
};

export default MembershipTable;
