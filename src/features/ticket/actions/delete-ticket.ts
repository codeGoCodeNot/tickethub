"use server";

import prisma from "@/lib/prisma";
import { ticketsPath } from "@/path";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

const deleteTicket = async (id: string) => {
  await prisma.ticket.delete({ where: { id } });

  revalidateTag("tickets", { expire: 0 });
  revalidateTag(`ticket-${id}`, { expire: 0 });
  revalidatePath(ticketsPath());
  redirect(ticketsPath());
};

export default deleteTicket;
