import prisma from "@/lib/prisma";
import { cacheTag } from "next/cache";

const getTicket = async (
  id: string,
  organizationId?: string,
  userId?: string,
) => {
  "use cache";
  cacheTag("tickets", `ticket-${id}`);
  return await prisma.ticket.findFirst({
    where: {
      id,
      OR: [
        { private: false },
        ...(organizationId ? [{ private: true, organizationId }] : []),
        ...(userId ? [{ private: true, userId }] : []),
      ],
    },
    include: {
      user: { select: { name: true, image: true } },
    },
  });
};

export default getTicket;
