import prisma from "@/lib/prisma";
import { cacheTag } from "next/cache";

const getPendingTickets = async (organizationId?: string) => {
  "use cache";
  cacheTag("tickets");

  return prisma.ticket.findMany({
    where: { organizationId, status: "PENDING" },
    orderBy: { createdAt: "asc" },
    include: {
      user: { select: { name: true, image: true } },
    },
  });
};

export default getPendingTickets;
