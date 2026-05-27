"use server";

import getAuthOrRedirect from "@/features/auth/queries/get-auth-or-redirect";
import isOwnerOrAdmin from "@/features/auth/utils/is-owner-or-admin";
import prisma from "@/lib/prisma";
import { updateTag } from "next/cache";
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

  updateTag("tickets");
};

export default approveTicket;
