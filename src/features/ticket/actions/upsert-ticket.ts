"use server";

import prisma from "@/lib/prisma";
import { ticketPath, ticketsPath } from "@/path";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

const upsertTicket = async (id: string, formData: FormData) => {
  const data = {
    title: formData.get("title") as string,
    content: formData.get("content") as string,
  };

  await prisma.ticket.upsert({
    where: { id },
    update: data,
    create: data,
  });

  revalidateTag("tickets", { expire: 0 });

  if (id) {
    revalidateTag(`ticket-${id}`, { expire: 0 });
    revalidatePath(ticketPath(id));
    redirect(ticketPath(id));
  } else {
    revalidatePath(ticketsPath());
  }
};

export default upsertTicket;
