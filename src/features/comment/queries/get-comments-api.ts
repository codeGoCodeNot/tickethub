"use server";

import prisma from "@/lib/prisma";

const getCommentsApi = async (
  ticketId: string,
  cursor?: {
    id: string;
    createdAt: number;
  },
) => {
  const where = {
    ticketId,
  };
  const take = 2;

  const [comments, count] = await Promise.all([
    prisma.comment.findMany({
      where,
      take: take + 1,
      cursor: cursor
        ? {
            id: cursor.id,
            createdAt: new Date(cursor.createdAt),
          }
        : undefined,
      skip: cursor ? 1 : undefined,
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    }),
    prisma.comment.count({ where }),
  ]);

  const list = comments.slice(0, take); // avoid ts error when comments is empty
  const lastComment = list?.at(-1);

  return {
    list,
    metadata: {
      count,
      hasNextPage: comments.length > take,
      cursor: lastComment
        ? {
            id: lastComment.id,
            createdAt: lastComment.createdAt.valueOf(),
          }
        : undefined,
    },
  };
};

export default getCommentsApi;
