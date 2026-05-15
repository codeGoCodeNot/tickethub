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
import { TICKET_STATUS_LABEL } from "../constants";
import updateTicketStatus from "../actions/update-ticket-status";
import { toast } from "sonner";
import { startTransition, useOptimistic } from "react";

type TicketMoreMenuProps = {
  ticket: Ticket;
  trigger: React.ReactNode;
};

const TicketMoreMenu = ({ ticket, trigger }: TicketMoreMenuProps) => {
  const [optimisticStatus, setOptimisticStatus] = useOptimistic(ticket.status);

  const handleUpdateTicketStatus = async (value: string) => {
    startTransition(async () => {
      setOptimisticStatus(value as TicketStatus);
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
