"use server";

import fromErrorToActionState, {
  toActionState,
  type ActionState,
} from "@/components/form/utils/to-action-state.ts";
import prisma from "@/lib/prisma";
import { ticketPath, ticketsPath } from "@/path";
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
});

const upsertTicket = async (
  id: string | undefined,
  _actionState: ActionState,
  formData: FormData,
) => {
  try {
    const { title, content } = upsertTicketSchema.parse(
      Object.fromEntries(formData.entries()),
    );

    await prisma.ticket.upsert({
      where: { id },
      update: { title, content },
      create: { title, content },
    });
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }

  revalidateTag("tickets", { expire: 0 });

  if (id) {
    revalidateTag(`ticket-${id}`, { expire: 0 });
    revalidatePath(ticketPath(id));
    redirect(ticketPath(id));
  } else {
    revalidatePath(ticketsPath());
  }

  return toActionState("SUCCESS", id ? "Ticket updated" : "Ticket created");
};

export default upsertTicket;
