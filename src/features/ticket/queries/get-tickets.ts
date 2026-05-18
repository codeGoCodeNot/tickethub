import prisma from "@/lib/prisma";
import { cacheTag } from "next/cache";

const getTickets = async (userId: string | undefined) => {
  "use cache";
  cacheTag("tickets");
  return await prisma.ticket.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  });
};

export default getTickets;
