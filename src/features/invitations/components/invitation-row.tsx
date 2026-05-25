"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import useConfirmDialog from "@/features/hook/use-confirm-dialog";
import deleteInvitation from "@/features/invitations/actions/delete-invitation";
import { organization } from "@/lib/auth-client";
import { motion } from "framer-motion";
import { LucideLoaderCircle, LucideTrash2, LucideX } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

const MotionTableRow = motion.create(TableRow);

type InvitationRowProps = {
  id: string;
  organizationId: string;
  email: string;
  role: string | null;
  status: string;
  createdAt: string;
  expiresAt: string;
};

const InvitationRow = ({
  id,
  organizationId,
  email,
  role,
  status,
  createdAt,
  expiresAt,
}: InvitationRowProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleCancel = () => {
    startTransition(async () => {
      const toastId = toast.loading("Cancelling invitation...");
      const { error } = await organization.cancelInvitation({ invitationId: id });
      if (error) {
        toast.error("Failed to cancel invitation.", { id: toastId });
        return;
      }
      toast.success("Invitation cancelled", { id: toastId });
      router.refresh();
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      const toastId = toast.loading("Deleting invitation...");
      const result = await deleteInvitation(id, organizationId);
      if (result?.status === "ERROR") {
        toast.error(result.message, { id: toastId });
        return;
      }
      toast.success("Invitation deleted", { id: toastId });
      router.refresh();
    });
  };

  const [cancelTrigger, cancelDialog] = useConfirmDialog({
    action: handleCancel,
    trigger: (
      <Button variant="ghost" size="icon" disabled={isPending}>
        {isPending ? <LucideLoaderCircle className="animate-spin" /> : <LucideX />}
      </Button>
    ),
    title: "Cancel Invitation?",
    description: "This will cancel the invitation sent to this email.",
  });

  const [deleteTrigger, deleteDialog] = useConfirmDialog({
    action: handleDelete,
    trigger: (
      <Button variant="destructive" size="icon" disabled={isPending}>
        {isPending ? <LucideLoaderCircle className="animate-spin" /> : <LucideTrash2 />}
      </Button>
    ),
    title: "Delete Invitation?",
    description: "This will permanently remove this invitation record.",
  });

  return (
    <MotionTableRow
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -60, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <TableCell>{email}</TableCell>
      <TableCell>
        <Badge variant="outline" className="capitalize">
          {role ?? "member"}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge
          variant={
            status === "accepted"
              ? "default"
              : status === "rejected" || status === "cancelled"
                ? "destructive"
                : "secondary"
          }
          className="capitalize"
        >
          {status}
        </Badge>
      </TableCell>
      <TableCell>{createdAt}</TableCell>
      <TableCell>{expiresAt}</TableCell>
      <TableCell className="relative z-[10]">
        {status === "pending" && cancelDialog}
        {status === "pending" && cancelTrigger}
        {status !== "pending" && deleteDialog}
        {status !== "pending" && deleteTrigger}
      </TableCell>
    </MotionTableRow>
  );
};

export default InvitationRow;
