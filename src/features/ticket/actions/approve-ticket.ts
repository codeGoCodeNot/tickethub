"use server";

import getAuthOrRedirect from "@/features/auth/queries/get-auth-or-redirect";
import isOwnerOrAdmin from "@/features/auth/utils/is-owner-or-admin";
import prisma from "@/lib/prisma";
import { ticketsPath } from "@/path";
import { revalidatePath, revalidateTag } from "next/cache";
import { forbidden } from "next/navigation";

const approveTicket = async (id: string) => {
  const user = await getAuthOrRedirect();

  const ticket = await prisma.ticket.findUnique({ where: { id } });
  if (!ticket) return;

  const adminOrOwner = await isOwnerOrAdmin(user.id, ticket.organizationId);
  if (!adminOrOwner) forbidden();

  await prisma.ticket.update({
    where: { id },
    data: { status: "OPEN" },
  });
  revalidateTag("tickets", { expire: 0 });
  revalidatePath(ticketsPath());
};

export default approveTicket;
