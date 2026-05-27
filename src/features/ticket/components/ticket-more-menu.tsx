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
import { ticketEditPath } from "@/path";
import { LucideFileEdit, LucideTrash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import updateTicketStatus from "../actions/update-ticket-status";
import { TICKET_STATUS_LABEL } from "../constants";
import TicketDeleteDialog from "./ticket-delete-dialog";

type TicketMoreMenuProps = {
  optimisticStatus: TicketStatus;
  onOptimisticStatusChange: (action: TicketStatus) => void;
  onStartTransition: React.TransitionStartFunction;
  ticket: Ticket;
  isTicketOwner: boolean;
  trigger: React.ReactNode;
  isOrgAdminOrOwner: boolean;
};

const TicketMoreMenu = ({
  ticket,
  trigger,
  optimisticStatus,
  onOptimisticStatusChange,
  onStartTransition,
  isTicketOwner,
  isOrgAdminOrOwner,
}: TicketMoreMenuProps) => {
  const handleUpdateTicketStatus = async (value: string) => {
    onStartTransition(async () => {
      onOptimisticStatusChange(value as TicketStatus);
      const state = await updateTicketStatus(ticket.id, value as TicketStatus);
      if (state.status === "ERROR" && state.message) toast.error(state.message);
      if (state.status === "SUCCESS") toast.success(state.message);
    });
  };

  const editButton = (
    <DropdownMenuItem asChild>
      <Link href={ticketEditPath(ticket.id)}>
        <LucideFileEdit className="h-4 w-4" />
        <span>Edit ticket</span>
      </Link>
    </DropdownMenuItem>
  );

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
          <DropdownMenuSeparator />
          {isTicketOwner && editButton}
          {isTicketOwner && <DropdownMenuSeparator />}
          <TicketDeleteDialog
            ticketId={ticket.id}
            title="Delete ticket"
            description="This action cannot be undone."
            isOrgAdminOrOwner={isOrgAdminOrOwner}
            type="removed"
            trigger={
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <LucideTrash2 className="h-4 w-4 text-destructive" />
                <span className="text-destructive">Delete</span>
              </DropdownMenuItem>
            }
          />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TicketMoreMenu;
