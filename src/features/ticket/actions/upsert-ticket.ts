"use server";

import { setCookieByKey } from "@/actions/cookies";
import fromErrorToActionState, {
  toActionState,
  type ActionState,
} from "@/components/form/utils/to-action-state";
import getAuthOrRedirect from "@/features/auth/queries/get-auth-or-redirect";
import isOwner from "@/features/auth/utils/is-owner";
import prisma from "@/lib/prisma";
import { ticketPath, ticketsPath } from "@/path";
import { toCent } from "@/utils/currency";

import { revalidatePath, revalidateTag } from "next/cache";
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

    const dbData = {
      ...data,
      userId: user.id,
      bounty: toCent(data.bounty),
    };

    await prisma.ticket.upsert({
      where: { id },
      update: dbData,
      create: dbData,
    });
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }

  revalidateTag("tickets", { expire: 0 });

  if (id) {
    revalidateTag(`ticket-${id}`, { expire: 0 });
    revalidatePath(ticketPath(id));
    await setCookieByKey("toast", "Ticket updated");
    redirect(ticketPath(id));
  } else {
    revalidatePath(ticketsPath());
  }

  return toActionState("SUCCESS", "Ticket created");
};

export default upsertTicket;
