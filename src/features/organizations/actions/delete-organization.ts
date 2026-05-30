"use server";

import fromErrorToActionState, {
  toActionState,
} from "@/components/form/utils/to-action-state";
import getAuthOrRedirect from "@/features/auth/queries/get-auth-or-redirect";
import { inngest } from "@/lib/inngest";
import prisma from "@/lib/prisma";

const deleteOrganization = async (organizationId: string) => {
  const user = await getAuthOrRedirect();

  const member = await prisma.member.findFirst({
    where: { organizationId, userId: user.id, role: "owner" },
  });

  if (!member)
    return toActionState("ERROR", "Not authorized to delete this organization");

  try {
    await prisma.organization.delete({
      where: { id: organizationId },
    });

    await inngest.send({
      name: "app/organization.deleted",
      data: { organizationId },
    });
  } catch (error) {
    return fromErrorToActionState(error);
  }
};

export default deleteOrganization;
