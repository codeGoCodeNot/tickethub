import prisma from "@/lib/prisma";
import { cacheTag } from "next/cache";

const getTickets = async () => {
  "use cache";
  cacheTag("tickets");
  return await prisma.ticket.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
  });
};

export default getTickets;
