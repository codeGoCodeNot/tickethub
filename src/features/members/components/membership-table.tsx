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
  }[];
};

const MembershipTable = ({ memberships }: MembershipTableProps): React.JSX.Element => {
  return (
    <TableBody>
      <AnimatePresence initial={false}>
        {memberships.map((m) => (
          <MembershipRow key={m.id} {...m} />
        ))}
      </AnimatePresence>
    </TableBody>
  );
};

export default MembershipTable;
