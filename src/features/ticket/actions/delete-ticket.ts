"use server";

import { setCookieByKey } from "@/actions/cookies";
import fromErrorToActionState, {
  toActionState,
} from "@/components/form/utils/to-action-state";
import getAuthOrRedirect from "@/features/auth/queries/get-auth-or-redirect";
import isOwner from "@/features/auth/utils/is-owner";
import prisma from "@/lib/prisma";
import { ticketsPath } from "@/path";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

const deleteTicket = async (id: string) => {
  const user = await getAuthOrRedirect();
  try {
    const ticket = await prisma.ticket.findUnique({ where: { id } });

    if (!ticket || !isOwner(user, ticket)) {
      return toActionState(
        "ERROR",
        "You are not authorized to delete this ticket",
      );
    }
    await prisma.ticket.delete({ where: { id } });
  } catch (error) {
    return fromErrorToActionState(error);
  }

  revalidateTag("tickets", { expire: 0 });
  revalidateTag(`ticket-${id}`, { expire: 0 });
  revalidatePath(ticketsPath());
  await setCookieByKey("toast", "Ticket deleted");
  redirect(ticketsPath());
};

export default deleteTicket;
