"use server";

import prisma from "@/lib/prisma";
import { ticketsPath } from "@/path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const deleteTicket = async (id: string) => {
  console.log("Deleting ticket:", id);

  try {
    await prisma.ticket.delete({ where: { id } });
    console.log("Deleted successfully");
  } catch (error) {
    console.error("Delete error:", error);
    throw error;
  }
  revalidatePath(ticketsPath());
  redirect(ticketsPath());
};

export default deleteTicket;
