"use client";

import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import useConfirmDialog from "@/features/hook/use-confirm-dialog";
import { organization } from "@/lib/auth-client";
import { motion } from "framer-motion";
import {
  LucideArrowLeftRight,
  LucideLoaderCircle,
  LucideTrash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

const MotionTableRow = motion(TableRow);

type OrganizationRowProps = {
  id: string;
  name: string;
  joinedAt: string;
  members: number;
  isActive: boolean;
  onSwitch: () => void;
};

const OrganizationRow = ({
  id,
  name,
  joinedAt,
  members,
  isActive,
  onSwitch,
}: OrganizationRowProps) => {
  const [isPending, setIsPending] = useState(false);
  const [isPendingDelete, startDeleteTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    startDeleteTransition(async () => {
      const toastId = toast.loading("Deleting organization...");
      const result = await organization.delete({ organizationId: id });
      if (result.error) {
        toast.error("Failed to delete organization.", { id: toastId });
        return;
      }
      toast.success("Organization deleted", { id: toastId });
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
        {deleteDialog}
        {deleteTrigger}
        </div>
      </TableCell>
    </MotionTableRow>
  );
};

export default OrganizationRow;
