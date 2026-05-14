import prisma from "@/lib/prisma";

const getTickets = async () => {
  return await prisma.ticket.findMany({
    orderBy: { createdAt: "desc" },
  });
};

export default getTickets;
