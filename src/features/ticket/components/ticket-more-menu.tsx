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

type TicketMoreMenuProps = {
  ticket: Ticket;
  trigger: React.ReactNode;
};

const TicketMoreMenu = ({ ticket, trigger }: TicketMoreMenuProps) => {
  const handleUpdateTicketStatus = async (value: string) => {
    const state = await updateTicketStatus(ticket.id, value as TicketStatus);
    if (state.status === "SUCCESS") toast.success(state.message);
    else if (state.status === "ERROR" && state.message)
      toast.error(state.message);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent side="right">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Ticket Status</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={ticket.status}
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
