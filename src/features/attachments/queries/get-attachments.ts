import prisma from "@/lib/prisma";
import { cacheTag } from "next/cache";

const getAttachments = async (ticketId: string) => {
  "use cache";
  cacheTag(`ticket-${ticketId}-attachments`);
  return await prisma.attachment.findMany({
    where: { ticketId },
  });
};

export default getAttachments;
