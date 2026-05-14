import prisma from "@/lib/prisma";

const getTicket = async (id: string) => {
  return await prisma.ticket.findUnique({
    where: { id },
  });
};

export default getTicket;
