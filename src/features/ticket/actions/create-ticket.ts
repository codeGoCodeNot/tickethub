"use server";

import prisma from "@/lib/prisma";
import { ticketsPath } from "@/path";
import { revalidatePath, revalidateTag } from "next/cache";

const createTicket = async (formData: FormData) => {
  const data = {
    title: formData.get("title") as string,
    content: formData.get("content") as string,
  };

  await prisma.ticket.create({
    data: {
      title: data.title,
      content: data.content,
    },
  });

  revalidateTag("tickets", { expire: 0 });
  revalidatePath(ticketsPath());
};

export default createTicket;
