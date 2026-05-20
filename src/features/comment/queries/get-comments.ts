import prisma from "@/lib/prisma";
import { cacheTag } from "next/cache";

const getComments = async (ticketId: string) => {
  "use cache";

  cacheTag(`ticket-${ticketId}-comments`);
  return await prisma.comment.findMany({
    where: { ticketId },
    take: 2,
    include: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
    },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
  });
};

export default getComments;
