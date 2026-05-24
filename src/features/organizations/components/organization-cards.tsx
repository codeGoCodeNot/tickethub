"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { organization, useActiveOrganization } from "@/lib/auth-client";
import {
  LucideArrowUpRightFromSquare,
  LucideLoaderCircle,
  LucideMenu,
  LucideUsers,
} from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import OrganizationMoreMenu from "./organization-more-menu";
import { motion } from "framer-motion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { membershipsPath } from "@/path";

type OrganizationCardsProps = {
  organizations: {
    id: string;
    name: string;
    joinedAt: string;
    members: number;
  }[];
  limitedAccess?: boolean;
};

const OrganizationCards = ({
  organizations,
  limitedAccess,
}: OrganizationCardsProps): React.JSX.Element => {
  const { data: activeOrg } = useActiveOrganization();
  const [optimisticActiveId, setOptimisticActiveId] = useState<string | null>(
    null,
  );
  const [pendingId, setPendingId] = useState<string | null>(null);
  const effectiveActiveId = optimisticActiveId ?? activeOrg?.id;
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [leaveTargetId, setLeaveTargetId] = useState<string | null>(null);
  const [isPendingDelete, startDeleteTransition] = useTransition();
  const [isPendingLeave, startLeaveTransition] = useTransition();
  const router = useRouter();

  const handleSwitch = async (id: string, name: string) => {
    setOptimisticActiveId(id);
    setPendingId(id);
    await organization.setActive({ organizationId: id });
    toast.success(`Switched to ${name}`);
    setPendingId(null);
  };

  const handleLeave = () => {
    if (!leaveTargetId) return;
    startLeaveTransition(async () => {
      const toastId = toast.loading("Leaving organization...");
      const { error } = await organization.leave({
        organizationId: leaveTargetId,
      });
      if (error) {
        toast.error("Failed to leave organization.", { id: toastId });
        return;
      }
      toast.success("Left organization", { id: toastId });
      setLeaveTargetId(null);
      await organization.setActive({ organizationId: null });
      router.refresh();
    });
  };

  const handleDelete = () => {
    if (!deleteTargetId) return;
    startDeleteTransition(async () => {
      const toastId = toast.loading("Deleting...");
      const { error } = await organization.delete({
        organizationId: deleteTargetId,
      });
      if (error) {
        toast.error("Failed to delete.", { id: toastId });
        return;
      }
      toast.success("Organization deleted", { id: toastId });
      setDeleteTargetId(null);
      router.refresh();
    });
  };

  return (
    <div className="flex flex-col gap-y-2">
      {organizations.map((org) => {
        const isActive = effectiveActiveId === org.id;
        const isPending = pendingId === org.id;
        return (
          <motion.div
            key={org.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="relative p-4 border rounded-md flex flex-col gap-y-1"
          >
            <div className="absolute top-2 right-2 z-[10]">
              {!limitedAccess && (
                <Button variant="ghost" size="icon" asChild>
                  <Link href={membershipsPath(org.id)}>
                    <LucideArrowUpRightFromSquare />
                  </Link>
                </Button>
              )}
              <OrganizationMoreMenu
                isActive={isActive}
                onSwitch={() => handleSwitch(org.id, org.name)}
                trigger={
                  <Button variant="ghost" size="icon">
                    <LucideMenu />
                  </Button>
                }
                onLeave={() => setLeaveTargetId(org.id)}
                onDelete={() => setDeleteTargetId(org.id)}
                limitedAccess={limitedAccess}
              />
            </div>
            <div className="flex items-center gap-x-2 pr-10">
              <span className="font-semibold truncate">{org.name}</span>
              {isActive &&
                (isPending ? (
                  <LucideLoaderCircle className="animate-spin size-3 shrink-0" />
                ) : (
                  <Badge className="shrink-0 text-xs" variant="secondary">
                    Active
                  </Badge>
                ))}
            </div>
            <span className="text-xs text-muted-foreground">
              Joined {org.joinedAt}
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-x-1">
              <LucideUsers className="size-3" />
              {org.members} members
            </span>
          </motion.div>
        );
      })}
      <AlertDialog
        open={!!leaveTargetId}
        onOpenChange={(o) => !o && setLeaveTargetId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Leave Organization?</AlertDialogTitle>
            <AlertDialogDescription>
              You will lose access to this organization.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPendingLeave}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleLeave} disabled={isPendingLeave}>
              {isPendingLeave ? (
                <LucideLoaderCircle className="animate-spin size-4" />
              ) : (
                "Continue"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog
        open={!!deleteTargetId}
        onOpenChange={(o) => !o && setDeleteTargetId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Organization?</AlertDialogTitle>
            <AlertDialogDescription>
              This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPendingDelete}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isPendingDelete}
            >
              {isPendingDelete ? (
                <LucideLoaderCircle className="animate-spin size-4" />
              ) : (
                "Continue"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default OrganizationCards;
