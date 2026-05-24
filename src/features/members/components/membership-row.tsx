"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import useConfirmDialog from "@/features/hook/use-confirm-dialog";
import { organization } from "@/lib/auth-client";
import { motion } from "framer-motion";
import { LucideLoaderCircle, LucideTrash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

const MotionTableRow = motion.create(TableRow);

type MembershipRowProps = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  joinedAt: string;
  role: string;
  userId?: string;
  currentUserId?: string;
  currentUserRole: string;
};

const MembershipRow = ({
  id,
  name,
  email,
  emailVerified,
  joinedAt,
  role,
  userId,
  currentUserId,
  currentUserRole,
}: MembershipRowProps) => {
  const isOwnerOrAdmin = ["owner", "admin"].includes(currentUserRole);
  const router = useRouter();
  const [isPendingDelete, startDeleteTransition] = useTransition();

  const handleDelete = () => {
    startDeleteTransition(async () => {
      const toastId = toast.loading("Deleting member...");
      const { error } = await organization.removeMember({
        memberIdOrEmail: id,
      });
      if (error) {
        toast.error("Failed to delete member.", { id: toastId });
        return;
      }
      toast.success("Member deleted", { id: toastId });
      router.refresh();
    });
  };

  const [deleteTrigger, deleteDialog] = useConfirmDialog({
    action: handleDelete,
    trigger: (
      <Button variant="destructive" size="icon" disabled={isPendingDelete}>
        {isPendingDelete ? (
          <LucideLoaderCircle className="animate-spin" />
        ) : (
          <LucideTrash2 />
        )}
      </Button>
    ),
    title: "Remove Member?",
    description: "This will remove the member from the organization.",
  });

  return (
    <MotionTableRow
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -60, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <TableCell>
        {name}
        {userId === currentUserId && <Badge className="ml-2">You</Badge>}
      </TableCell>
      <TableCell>{email}</TableCell>
      <TableCell>
        <Badge variant="outline" className="capitalize">
          {role}
        </Badge>
      </TableCell>
      <TableCell>{joinedAt}</TableCell>
      <TableCell>
        <Badge variant={emailVerified ? "default" : "secondary"}>
          {emailVerified ? "Verified" : "Unverified"}
        </Badge>
      </TableCell>
      <TableCell className="relative z-[10]">
        {isOwnerOrAdmin && deleteDialog}
        {isOwnerOrAdmin && deleteTrigger}
      </TableCell>
    </MotionTableRow>
  );
};

export default MembershipRow;
