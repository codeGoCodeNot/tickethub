"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { organization } from "@/lib/auth-client";
import { AnimatePresence, motion } from "framer-motion";
import { LucideLoaderCircle, LucideMail, LucideMenu, LucideShield } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import MembershipMoreMenu from "./membership-more-menu";

type MembershipCardsProps = {
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
  currentUserRole: string;
};

const MembershipCards = ({
  memberships,
  currentUserId,
  currentUserRole,
}: MembershipCardsProps): React.JSX.Element => {
  const isOwnerOrAdmin = ["owner", "admin"].includes(currentUserRole);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isPendingDelete, startDeleteTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    if (!deleteTargetId) return;
    startDeleteTransition(async () => {
      const toastId = toast.loading("Removing member...");
      const { error } = await organization.removeMember({
        memberIdOrEmail: deleteTargetId,
      });
      if (error) {
        toast.error("Failed to remove member.", { id: toastId });
        return;
      }
      toast.success("Member removed", { id: toastId });
      setDeleteTargetId(null);
      router.refresh();
    });
  };

  return (
    <div className="flex flex-col gap-y-2">
      <AnimatePresence initial={false}>
        {memberships.map((membership) => (
          <motion.div
            key={membership.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -60, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative p-4 border rounded-md flex flex-col gap-y-1"
          >
            <div className="absolute top-2 right-2 z-[10]">
              {isOwnerOrAdmin && (
                <MembershipMoreMenu
                  onDelete={() => setDeleteTargetId(membership.id)}
                  trigger={
                    <Button variant="ghost" size="icon">
                      <LucideMenu />
                    </Button>
                  }
                />
              )}
            </div>
            <div className="flex items-center gap-x-2 pr-10">
              <span className="font-semibold truncate">{membership.name}</span>
              <Badge variant="outline" className="capitalize shrink-0 text-xs">
                {membership.role}
              </Badge>
              {membership.userId === currentUserId && (
                <Badge variant="secondary" className="shrink-0 text-xs">
                  You
                </Badge>
              )}
            </div>
            <span className="text-xs text-muted-foreground flex items-center gap-x-1">
              <LucideMail className="size-3" />
              {membership.email}
            </span>
            <span className="text-xs text-muted-foreground">
              Joined {membership.joinedAt}
            </span>
            <div className="flex items-center gap-x-1 mt-1">
              <LucideShield className="size-3" />
              <Badge
                variant={membership.emailVerified ? "default" : "secondary"}
                className="text-xs"
              >
                {membership.emailVerified ? "Verified" : "Unverified"}
              </Badge>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      <AlertDialog
        open={!!deleteTargetId}
        onOpenChange={(o) => !o && setDeleteTargetId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Member?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the member from the organization.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPendingDelete}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isPendingDelete}>
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

export default MembershipCards;
