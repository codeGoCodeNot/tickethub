"use client";

import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import useConfirmDialog from "@/features/hook/use-confirm-dialog";
import { organization } from "@/lib/auth-client";
import { membershipsPath } from "@/path";
import { motion } from "framer-motion";
import {
  LucideArrowLeftRight,
  LucideArrowUpRightFromSquare,
  LucideLoaderCircle,
  LucideLogOut,
  LucideTrash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

const MotionTableRow = motion.create(TableRow);

type OrganizationRowProps = {
  id: string;
  name: string;
  joinedAt: string;
  members: number;
  isActive: boolean;
  onSwitch: () => void;
  limitedAccess?: boolean;
};

const OrganizationRow = ({
  id,
  name,
  joinedAt,
  members,
  isActive,
  onSwitch,
  limitedAccess,
}: OrganizationRowProps) => {
  const [isPending, setIsPending] = useState(false);
  const [isPendingDelete, startDeleteTransition] = useTransition();
  const [isPendingLeave, startLeaveTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    startDeleteTransition(async () => {
      const toastId = toast.loading("Deleting organization...");
      const { error } = await organization.delete({ organizationId: id });
      if (error) {
        toast.error("Failed to delete organization.", { id: toastId });
        return;
      }
      toast.success("Organization deleted", { id: toastId });
      router.refresh();
    });
  };

  const handleLeave = () => {
    startLeaveTransition(async () => {
      const toastId = toast.loading("Leaving organization...");
      const { error } = await organization.leave({ organizationId: id });
      if (error) {
        toast.error("Failed to leave organization.", { id: toastId });
        return;
      }
      toast.success("Left the organization", { id: toastId });
      await organization.setActive({ organizationId: null });
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
    title: "Delete Organization?",
    description:
      "This will permanently delete this organization and all its data.",
  });

  const [leaveTrigger, leaveDialog] = useConfirmDialog({
    action: handleLeave,
    trigger: (
      <Button variant="outline" size="icon" disabled={isPendingLeave}>
        {isPendingLeave ? (
          <LucideLoaderCircle className="animate-spin" />
        ) : (
          <LucideLogOut />
        )}
      </Button>
    ),
    title: "Leave Organization?",
    description:
      "This will permanently leave this organization and all its data.",
  });

  const detailsButton = (
    <Button variant="outline" size="icon" asChild>
      <Link href={membershipsPath(id)}>
        <LucideArrowUpRightFromSquare />
      </Link>
    </Button>
  );

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
        <div className="flex gap-x-1">
          <Button
            size="icon"
            variant={isActive ? "default" : "outline"}
            disabled={isActive || isPending}
            onClick={async () => {
              onSwitch();
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
          {!limitedAccess && detailsButton}
          {!limitedAccess && leaveDialog}
          {!limitedAccess && leaveTrigger}
          {!limitedAccess && deleteDialog}
          {!limitedAccess && deleteTrigger}
        </div>
      </TableCell>
    </MotionTableRow>
  );
};

export default OrganizationRow;
