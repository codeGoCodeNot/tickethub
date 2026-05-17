import prisma from "@/lib/prisma";
import { cacheTag } from "next/cache";

const getTicket = async (id: string) => {
  "use cache";
  cacheTag("tickets", `ticket-${id}`);
  return await prisma.ticket.findUnique({
    where: { id },
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

export default getTicket;
