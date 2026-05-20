"use server";

import prisma from "@/lib/prisma";

const getCommentsApi = async (ticketId: string, offset?: number) => {
  const where = { ticketId };
  const skip = offset ?? 0;
  const take = 2;

  const [comments, count] = await Promise.all([
    prisma.comment.findMany({
      where,
      skip,
      take,
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.comment.count({ where }),
  ]);

  return {
    list: comments,
    metadata: { count, hasNextPage: count > skip + take },
  };
};

export default getCommentsApi;
