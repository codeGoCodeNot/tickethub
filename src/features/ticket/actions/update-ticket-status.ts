"use server";

import fromErrorToActionState, {
  toActionState,
} from "@/components/form/utils/to-action-state";
import getAuthOrRedirect from "@/features/auth/queries/get-auth-or-redirect";
import isOwner from "@/features/auth/utils/is-owner";
import { TicketStatus } from "@/generated/prisma/enums";
import prisma from "@/lib/prisma";
import { updateTag } from "next/cache";

const updateTicketStatus = async (id: string, status: TicketStatus) => {
  const user = await getAuthOrRedirect();

  try {
    const ticket = await prisma.ticket.findUnique({ where: { id } });
    if (!ticket || !isOwner(user, ticket)) {
      return toActionState(
        "ERROR",
        "You are not authorized to update this ticket",
      );
    }

    await prisma.ticket.update({
      where: { id },
      data: { status },
    });

    updateTag("tickets");
    updateTag(`ticket-${id}`);
  } catch (error) {
    return fromErrorToActionState(error);
  }

  return toActionState("SUCCESS", "Ticket status updated");
};

export default updateTicketStatus;
