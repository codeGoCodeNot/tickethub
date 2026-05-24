import { getAuth } from "@/features/auth/queries/get-auth";
import prisma from "@/lib/prisma";
import { forbidden } from "next/navigation";

const getOrgOwnerOrRedirect = async (organizationId: string) => {
  const user = await getAuth();

  const member = await prisma.member.findFirst({
    where: { organizationId, userId: user?.id },
  });

  if (!member || !["owner", "admin"].includes(member.role)) forbidden();

  return member;
};

export default getOrgOwnerOrRedirect;
