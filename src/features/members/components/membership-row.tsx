"use client";

import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { motion } from "framer-motion";

const MotionTableRow = motion.create(TableRow);

type MembershipRowProps = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  joinedAt: string;
  role: string;
};

const MembershipRow = ({ name, email, emailVerified, joinedAt, role }: MembershipRowProps) => {
  return (
    <MotionTableRow
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -60, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <TableCell>{name}</TableCell>
      <TableCell>{email}</TableCell>
      <TableCell>
        <Badge variant="outline" className="capitalize">{role}</Badge>
      </TableCell>
      <TableCell>{joinedAt}</TableCell>
      <TableCell>
        <Badge variant={emailVerified ? "default" : "secondary"}>
          {emailVerified ? "Verified" : "Unverified"}
        </Badge>
      </TableCell>
    </MotionTableRow>
  );
};

export default MembershipRow;
