"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import deleteTicket from "../actions/delete-ticket";
import { toast } from "sonner";
import { isRedirectError } from "next/dist/client/components/redirect-error";

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
      const toastId = toast.loading("Deleting ticket...");
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
        toast.error("Failed to delete ticket.", { id: toastId });
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
              <Label>Reason for deletion</Label>
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
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TicketDeleteDialog;
