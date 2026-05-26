"use server";

import { setCookieByKey } from "@/actions/cookies";
import fromErrorToActionState, {
  toActionState,
} from "@/components/form/utils/to-action-state";
import getAuthOrRedirect from "@/features/auth/queries/get-auth-or-redirect";
import isOwner from "@/features/auth/utils/is-owner";
import isOwnerOrAdmin from "@/features/auth/utils/is-owner-or-admin";
import { inngest } from "@/lib/inngest";
import prisma from "@/lib/prisma";
import { ticketsByOrganizationPath, ticketsPath } from "@/path";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

const deleteTicket = async (id: string, reason?: string) => {
  const user = await getAuthOrRedirect();
  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id },
      include: {
        user: {
          select: { email: true, name: true },
        },
        organization: { select: { name: true } },
      },
    });
    const adminOrOwner = ticket
      ? await isOwnerOrAdmin(user.id, ticket?.organizationId)
      : false;

    if (!ticket || (!isOwner(user, ticket) && !adminOrOwner)) {
      return toActionState(
        "ERROR",
        "You are not authorized to delete this ticket",
      );
    }

    await prisma.ticket.delete({ where: { id } });

    if (adminOrOwner && !isOwner(user, ticket) && reason) {
      await inngest.send({
        name: "app/ticket-deleted",
        data: {
          memberEmail: ticket?.user.email,
          memberName: ticket?.user.name,
          ticketTitle: ticket?.title,
          organizationName: ticket?.organization.name,
          reason,
          adminName: user.name,
        },
      });
    }
  } catch (error) {
    return fromErrorToActionState(error);
  }

  revalidateTag("tickets", { expire: 0 });
  revalidateTag(`ticket-${id}`, { expire: 0 });
  revalidateTag("tickets/organization", { expire: 0 });
  revalidatePath(ticketsPath());
  revalidatePath(ticketsByOrganizationPath());
  await setCookieByKey("toast", "Ticket deleted");
  redirect(ticketsPath());
};

export default deleteTicket;
