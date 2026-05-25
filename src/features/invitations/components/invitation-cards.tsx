"use client";

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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import deleteInvitation from "@/features/invitations/actions/delete-invitation";
import { organization } from "@/lib/auth-client";
import { AnimatePresence, motion } from "framer-motion";
import { LucideLoaderCircle, LucideMail, LucideTrash2, LucideX } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

type InvitationCardsProps = {
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

const InvitationCards = ({ invitations }: InvitationCardsProps) => {
  const [cancelTargetId, setCancelTargetId] = useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<{ id: string; organizationId: string } | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleCancel = () => {
    if (!cancelTargetId) return;
    startTransition(async () => {
      const toastId = toast.loading("Cancelling invitation...");
      const { error } = await organization.cancelInvitation({ invitationId: cancelTargetId });
      if (error) {
        toast.error("Failed to cancel invitation.", { id: toastId });
        return;
      }
      toast.success("Invitation cancelled", { id: toastId });
      setCancelTargetId(null);
      router.refresh();
    });
  };

  const handleDelete = () => {
    if (!deleteTargetId) return;
    startTransition(async () => {
      const toastId = toast.loading("Deleting invitation...");
      const result = await deleteInvitation(deleteTargetId.id, deleteTargetId.organizationId);
      if (result?.status === "ERROR") {
        toast.error(result.message, { id: toastId });
        return;
      }
      toast.success("Invitation deleted", { id: toastId });
      setDeleteTargetId(null);
      router.refresh();
    });
  };

  return (
    <div className="flex flex-col gap-y-2">
      <AnimatePresence initial={false}>
        {invitations.map((inv) => (
          <motion.div
            key={inv.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -60, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative p-4 border rounded-md flex flex-col gap-y-1"
          >
            <div className="absolute top-2 right-2 z-[10]">
              {inv.status === "pending" ? (
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={isPending}
                  onClick={() => setCancelTargetId(inv.id)}
                >
                  <LucideX />
                </Button>
              ) : (
                <Button
                  variant="destructive"
                  size="icon"
                  disabled={isPending}
                  onClick={() => setDeleteTargetId({ id: inv.id, organizationId: inv.organizationId })}
                >
                  <LucideTrash2 />
                </Button>
              )}
            </div>
            <div className="flex items-center gap-x-2 pr-10">
              <Badge variant="outline" className="capitalize text-xs">
                {inv.role ?? "member"}
              </Badge>
              <Badge
                variant={
                  inv.status === "accepted"
                    ? "default"
                    : inv.status === "rejected" || inv.status === "cancelled"
                      ? "destructive"
                      : "secondary"
                }
                className="capitalize text-xs"
              >
                {inv.status}
              </Badge>
            </div>
            <span className="text-sm font-semibold flex items-center gap-x-1 pr-10">
              <LucideMail className="size-3 shrink-0" />
              <span className="truncate">{inv.email}</span>
            </span>
            <span className="text-xs text-muted-foreground">Invited {inv.createdAt}</span>
            <span className="text-xs text-muted-foreground">Expires {inv.expiresAt}</span>
          </motion.div>
        ))}
      </AnimatePresence>

      <AlertDialog open={!!cancelTargetId} onOpenChange={(o) => !o && setCancelTargetId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Invitation?</AlertDialogTitle>
            <AlertDialogDescription>
              This will cancel the invitation sent to this email.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Back</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancel} disabled={isPending}>
              {isPending ? <LucideLoaderCircle className="animate-spin size-4" /> : "Continue"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!deleteTargetId} onOpenChange={(o) => !o && setDeleteTargetId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Invitation?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove this invitation record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Back</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isPending}>
              {isPending ? <LucideLoaderCircle className="animate-spin size-4" /> : "Continue"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default InvitationCards;
