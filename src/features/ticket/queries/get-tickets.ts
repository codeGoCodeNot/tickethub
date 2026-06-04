import prisma from "@/lib/prisma";
import { cacheTag } from "next/cache";

const getTickets = async (
  userId?: string,
  organizationId?: string,
  search?: string,
  sort?: string,
  page = 0,
  size = 5,
  isOwnerOrAdmin = false,
) => {
  "use cache";
  cacheTag("tickets");

  const where = {
    userId,
    organizationId,
    ...(search && {
      title: { contains: search, mode: "insensitive" as const },
    }),
    ...(!isOwnerOrAdmin && { status: { not: "PENDING" as const } }),
    OR: [
      { private: false },
      ...(organizationId ? [{ private: true, organizationId }] : []),
      ...(userId ? [{ private: true, userId }] : []),
    ],
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
            : sort === "deadline"
              ? { deadline: "asc" }
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
