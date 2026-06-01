"use server";

import { setCookieByKey } from "@/actions/cookies";
import fromErrorToActionState, {
  toActionState,
  type ActionState,
} from "@/components/form/utils/to-action-state";
import createActivityLog from "@/features/activity-logs/actions/create-activity-log";
import getAuthOrRedirect from "@/features/auth/queries/get-auth-or-redirect";
import isOwner from "@/features/auth/utils/is-owner";
import isOwnerOrAdmin from "@/features/auth/utils/is-owner-or-admin";
import getActiveOrganization from "@/features/organizations/queries/get-active-organization";
import prisma from "@/lib/prisma";
import { ticketPath } from "@/path";
import { toCent } from "@/utils/currency";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const upsertTicketSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(191, "Title must be less than 191 characters"),
  content: z.string().trim().min(1, "Content is required"),
  deadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Is required"),
  bounty: z.coerce.number().min(0.1, "Bounty must be a positive number"),
});

const upsertTicket = async (
  id: string | undefined,
  _actionState: ActionState,
  formData: FormData,
) => {
  const user = await getAuthOrRedirect();
  const organizationId = await getActiveOrganization();

  let ticketTitle = "";

  if (!organizationId) {
    return toActionState(
      "ERROR",
      "No active organization. Please switch to an organization to create a ticket.",
    );
  }
  const adminOrOwner = await isOwnerOrAdmin(user.id, organizationId);

  try {
    if (id) {
      const ticket = await prisma.ticket.findUnique({ where: { id } });

      if (!ticket || !isOwner(user, ticket)) {
        return toActionState(
          "ERROR",
          "You are not authorized to edit this ticket",
        );
      }
    }

    const data = upsertTicketSchema.parse(
      Object.fromEntries(formData.entries()),
    );

    ticketTitle = data.title;

    const dbData = {
      ...data,
      userId: user.id,
      bounty: toCent(data.bounty),
    };

    await prisma.ticket.upsert({
      where: { id },
      update: dbData,
      create: {
        ...dbData,
        organizationId,
        status: adminOrOwner ? "OPEN" : "PENDING",
      },
    });
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }

  await createActivityLog({
    organizationId,
    userId: user.id,
    action: id ? "ticket.updated" : "ticket.created",
    metadata: {
      ticketTitle,
      ...(id ? {} : { status: adminOrOwner ? "OPEN" : "PENDING" }),
    },
  });

  updateTag("tickets");

  if (id) {
    updateTag(`ticket-${id}`);
    await setCookieByKey("toast", "Ticket updated");
    redirect(ticketPath(id));
  }

  return toActionState(
    "SUCCESS",
    adminOrOwner ? "Ticket created" : "Ticket submitted for approval",
  );
};

export default upsertTicket;
