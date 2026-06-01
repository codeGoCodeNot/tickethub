"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import deleteTicket from "../actions/delete-ticket";

type TicketDeleteDialogProps = {
  ticketId: string;
  trigger: React.ReactNode;
  isOrgAdminOrOwner: boolean;
  title: string;
  description: string;
  type: "removed" | "rejected";
};

const TicketDeleteDialog = ({
  ticketId,
  trigger,
  isOrgAdminOrOwner,
  title,
  description,
  type,
}: TicketDeleteDialogProps) => {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const toastId = toast.loading(
        type === "removed" ? "Removing ticket..." : "Rejecting ticket...",
      );
      try {
        const state = await deleteTicket(
          ticketId,
          isOrgAdminOrOwner ? reason : undefined,
          type,
        );
        if (state?.status === "ERROR") {
          toast.error(state.message, { id: toastId });
          return;
        }
        toast.dismiss(toastId);
      } catch (err) {
        if (isRedirectError(err)) {
          toast.dismiss(toastId);
          throw err;
        }
        toast.error(
          type === "removed"
            ? "Failed to remove ticket."
            : "Failed to reject ticket.",
          { id: toastId },
        );
      }
    });
  };

  return (
    <>
      <span onClick={() => setOpen(true)}>{trigger}</span>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          {isOrgAdminOrOwner && (
            <div className="flex flex-col gap-y-2">
              <Label>
                Reason for {type === "removed" ? "removal" : "rejection"}
              </Label>
              <Textarea
                placeholder="Explain why this ticket is being removed..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
              />
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isPending || (isOrgAdminOrOwner && !reason.trim())}
            >
              {type === "removed" ? "Remove" : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TicketDeleteDialog;
