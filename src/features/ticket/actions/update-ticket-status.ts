"use server";

import fromErrorToActionState, {
  toActionState,
} from "@/components/form/utils/to-action-state.ts";
import { TicketStatus } from "@/generated/prisma/enums";
import prisma from "@/lib/prisma";
import { ticketsPath } from "@/path";
import { revalidatePath, revalidateTag } from "next/cache";

const updateTicketStatus = async (id: string, status: TicketStatus) => {
  try {
    await prisma.ticket.update({
      where: { id },
      data: { status },
    });

    revalidateTag("tickets", { expire: 0 });
    revalidateTag(`ticket-${id}`, { expire: 0 });
    revalidatePath(ticketsPath());
  } catch (error) {
    return fromErrorToActionState(error);
  }

  return toActionState("SUCCESS", "Ticket status updated");
};

export default updateTicketStatus;
