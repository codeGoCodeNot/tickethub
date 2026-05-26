"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import useConfirmDialog from "@/features/hook/use-confirm-dialog";
import { Ticket, TicketStatus } from "@/generated/prisma/client";
import { ticketEditPath } from "@/path";
import { LucideFileEdit, LucideTrash2 } from "lucide-react";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import Link from "next/link";
import { toast } from "sonner";
import deleteTicket from "../actions/delete-ticket";
import updateTicketStatus from "../actions/update-ticket-status";
import { TICKET_STATUS_LABEL } from "../constants";

type TicketMoreMenuProps = {
  optimisticStatus: TicketStatus;
  onOptimisticStatusChange: (action: TicketStatus) => void;
  onStartTransition: React.TransitionStartFunction;
  ticket: Ticket;
  isTicketOwner: boolean;
  trigger: React.ReactNode;
};

const TicketMoreMenu = ({
  ticket,
  trigger,
  optimisticStatus,
  onOptimisticStatusChange,
  onStartTransition,
  isTicketOwner,
}: TicketMoreMenuProps) => {
  const handleUpdateTicketStatus = async (value: string) => {
    onStartTransition(async () => {
      onOptimisticStatusChange(value as TicketStatus);
      const state = await updateTicketStatus(ticket.id, value as TicketStatus);
      if (state.status === "ERROR" && state.message) toast.error(state.message);
      if (state.status === "SUCCESS") toast.success(state.message);
    });
  };

  const deleteWithToast = async () => {
    const id = toast.loading("Deleting ticket...");
    try {
      const actionState = await deleteTicket(ticket.id);
      if (actionState?.status === "ERROR") {
        toast.error(actionState.message, { id });
        return;
      }
      toast.dismiss(id);
    } catch (err) {
      if (isRedirectError(err)) {
        toast.dismiss(id);
        throw err;
      }
      toast.error("Failed to delete ticket.", { id });
    }
  };

  const [deleteDialogTrigger, deleteDialog] = useConfirmDialog({
    action: deleteWithToast,
    trigger: (
      <DropdownMenuItem>
        <LucideTrash2 className="h-4 w-4 text-destructive" />
        <span className="text-destructive">Delete</span>
      </DropdownMenuItem>
    ),
    title: "Are you sure you want to delete this ticket?",
  });

  const editButton = (
    <DropdownMenuItem asChild>
      <Link href={ticketEditPath(ticket.id)}>
        <LucideFileEdit className="h-4 w-4" />
        <span>Edit ticket</span>
      </Link>
    </DropdownMenuItem>
  );

  return (
    <>
      {deleteDialog}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
        <DropdownMenuContent side="right">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Ticket Status</DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={optimisticStatus}
              onValueChange={handleUpdateTicketStatus}
            >
              {(Object.keys(TICKET_STATUS_LABEL) as TicketStatus[]).map(
                (status) => (
                  <DropdownMenuRadioItem value={status} key={status}>
                    {TICKET_STATUS_LABEL[status]}
                  </DropdownMenuRadioItem>
                ),
              )}
            </DropdownMenuRadioGroup>
            <DropdownMenuSeparator />
            {isTicketOwner && editButton}
            {isTicketOwner && <DropdownMenuSeparator />}
            {deleteDialogTrigger}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default TicketMoreMenu;
