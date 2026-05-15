"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Ticket, TicketStatus } from "@/generated/prisma/client";
import { toast } from "sonner";
import updateTicketStatus from "../actions/update-ticket-status";
import { TICKET_STATUS_LABEL } from "../constants";

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

  return (
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
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TicketMoreMenu;
