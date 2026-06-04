import prisma from "@/lib/prisma";
import { cacheTag } from "next/cache";

const getTicket = async (id: string, organizationId?: string) => {
  "use cache";
  cacheTag("tickets", `ticket-${id}`);
  return await prisma.ticket.findFirst({
    where: {
      id,
      OR: [
        { private: false },
        ...(organizationId ? [{ private: true, organizationId }] : []),
      ],
    },
    include: {
      user: { select: { name: true, image: true } },
    },
  });
};

export default getTicket;
