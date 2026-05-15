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

import { Ticket, TicketStatus } from "@/generated/prisma/client";
import { toast } from "sonner";
import updateTicketStatus from "../actions/update-ticket-status";
import { TICKET_STATUS_LABEL } from "../constants";
import useConfirmDialog from "@/features/hook/use-confirm-dialog";
import deleteTicket from "../actions/delete-ticket";
import { LucideTrash2 } from "lucide-react";

type TicketMoreMenuProps = {
  optimisticStatus: TicketStatus;
  onOptimisticStatusChange: (action: TicketStatus) => void;
  onStartTransition: React.TransitionStartFunction;
  ticket: Ticket;
  trigger: React.ReactNode;
};

const TicketMoreMenu = ({
  ticket,
  trigger,
  optimisticStatus,
  onOptimisticStatusChange,
  onStartTransition,
}: TicketMoreMenuProps) => {
  const handleUpdateTicketStatus = async (value: string) => {
    onStartTransition(async () => {
      onOptimisticStatusChange(value as TicketStatus);
      const state = await updateTicketStatus(ticket.id, value as TicketStatus);
      if (state.status === "ERROR" && state.message) toast.error(state.message);
      if (state.status === "SUCCESS") toast.success(state.message);
    });
  };

  const [deleteDialogTrigger, deleteDialog] = useConfirmDialog({
    action: deleteTicket.bind(null, ticket.id),
    trigger: (
      <DropdownMenuItem>
        <LucideTrash2 className="h-4 w-4 text-destructive" />
        <span className="text-destructive">Delete</span>
      </DropdownMenuItem>
    ),
    title: "Are you sure you want to delete this ticket?",
  });

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
            {deleteDialogTrigger}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default TicketMoreMenu;
