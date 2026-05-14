"use server";

import prisma from "@/lib/prisma";
import { ticketPath } from "@/path";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

const editTicket = async (id: string, formData: FormData) => {
  const data = {
    title: formData.get("title") as string,
    content: formData.get("content") as string,
  };

  await prisma.ticket.update({
    where: { id },
    data: {
      title: data.title,
      content: data.content,
    },
  });

  revalidateTag("tickets", { expire: 0 });
  revalidateTag(`ticket-${id}`, { expire: 0 });
  revalidatePath(ticketPath(id));
  redirect(ticketPath(id));
};

export default editTicket;
