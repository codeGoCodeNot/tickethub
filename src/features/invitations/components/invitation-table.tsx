"use client";

import { TableBody } from "@/components/ui/table";
import { AnimatePresence } from "framer-motion";
import InvitationRow from "./invitation-row";

type InvitationTableProps = {
  invitations: {
    id: string;
    organizationId: string;
    email: string;
    role: string | null;
    status: string;
    createdAt: string;
    expiresAt: string;
  }[];
};

const InvitationTable = ({ invitations }: InvitationTableProps) => (
  <TableBody>
    <AnimatePresence initial={false}>
      {invitations.map((invitation) => (
        <InvitationRow key={invitation.id} {...invitation} />
      ))}
    </AnimatePresence>
  </TableBody>
);

export default InvitationTable;
