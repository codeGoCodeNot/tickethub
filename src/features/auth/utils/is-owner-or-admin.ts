import prisma from "@/lib/prisma";

const isOwnerOrAdmin = async (userId: string | undefined, organizationId: string) => {
  const member = await prisma.member.findFirst({
    where: { userId, organizationId },
  });
  return ["owner", "admin"].includes(member?.role ?? "");
};

export default isOwnerOrAdmin;
