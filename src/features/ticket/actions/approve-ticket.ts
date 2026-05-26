"use server";

import prisma from "@/lib/prisma";
import { ticketsPath } from "@/path";
import { revalidatePath, revalidateTag } from "next/cache";

const approveTicket = async (id: string) => {
  await prisma.ticket.update({
    where: { id },
    data: { status: "OPEN" },
  });
  revalidateTag("tickets", { expire: 0 });
  revalidatePath(ticketsPath());
};

export default approveTicket;
