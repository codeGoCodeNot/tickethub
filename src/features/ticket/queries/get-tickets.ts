import prisma from "@/lib/prisma";
import { cacheTag } from "next/cache";

const getTickets = async (
  userId?: string,
  search?: string,
  sort?: string,
  page = 0,
  size = 5,
) => {
  "use cache";
  cacheTag("tickets");
  const where = {
    userId,
    ...(search && {
      title: { contains: search, mode: "insensitive" as const },
    }),
  };

  const skip = page * size;
  const take = size;

  const [tickets, count] = await Promise.all([
    prisma.ticket.findMany({
      where,
      skip,
      take,
      orderBy:
        sort === "bounty"
          ? { bounty: "desc" }
          : sort === "oldest"
            ? { createdAt: "asc" }
            : { createdAt: "desc" },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    }),
    prisma.ticket.count({ where }),
  ]);

  return {
    list: tickets,
    metadata: {
      count,
      hasNextPage: count > skip + take,
    },
  };
};

export default getTickets;
