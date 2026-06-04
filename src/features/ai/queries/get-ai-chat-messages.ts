import getAuthOrRedirect from "@/features/auth/queries/get-auth-or-redirect";
import prisma from "@/lib/prisma";

const getAiChatMessages = async () => {
  const user = await getAuthOrRedirect();

  return prisma.aiChat.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "asc" },
    take: 50,
  });
};

export default getAiChatMessages;
