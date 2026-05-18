import prisma from "@/lib/prisma";
import { cacheTag } from "next/cache";

const getTickets = async (userId?: string, search?: string, sort?: string) => {
  "use cache";
  cacheTag("tickets");
  return await prisma.ticket.findMany({
    where: {
      userId,
      ...(search && { title: { contains: search, mode: "insensitive" } }),
    },
    orderBy: sort === "bounty" ? { bounty: "desc" } : { createdAt: "desc" },
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
