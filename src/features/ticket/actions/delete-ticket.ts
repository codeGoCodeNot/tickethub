"use server";

import { setCookieByKey } from "@/actions/cookies";
import fromErrorToActionState, {
  toActionState,
} from "@/components/form/utils/to-action-state";
import createActivityLog from "@/features/activity-logs/actions/create-activity-log";
import getAuthOrRedirect from "@/features/auth/queries/get-auth-or-redirect";
import isOwner from "@/features/auth/utils/is-owner";
import isOwnerOrAdmin from "@/features/auth/utils/is-owner-or-admin";
import { inngest } from "@/lib/inngest";
import prisma from "@/lib/prisma";
import { ticketsPath } from "@/path";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";

const deleteTicket = async (
  id: string,
  reason?: string,
  type?: "removed" | "rejected",
) => {
  const user = await getAuthOrRedirect();
  let ticketData: { organizationId: string; title: string } | null = null;
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

    ticketData = { organizationId: ticket.organizationId, title: ticket.title };

    await prisma.ticket.delete({ where: { id } });

    await inngest.send({
      name: "app/attachment.deleted",
      data: {
        prefix: `${ticket.organizationId}/TICKET/${id}/`,
      },
    });

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
          type,
        },
      });
    }
  } catch (error) {
    return fromErrorToActionState(error);
  }

  if (ticketData) {
    await createActivityLog({
      organizationId: ticketData.organizationId,
      userId: user.id,
      action: type === "rejected" ? "ticket.rejected" : "ticket.removed",
      metadata: {
        ticketTitle: ticketData.title,
        ...(reason ? { reason } : {}),
      },
    });
  }

  updateTag("tickets");
  updateTag(`ticket-${id}`);
  updateTag(`tickets/organization`);
  await setCookieByKey(
    "toast",
    type === "removed" ? "Ticket removed" : "Ticket rejected",
  );
  redirect(ticketsPath());
};

export default deleteTicket;
