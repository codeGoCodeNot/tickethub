"use server";

import fromErrorToActionState, {
  toActionState,
} from "@/components/form/utils/to-action-state";
import getAuthOrRedirect from "@/features/auth/queries/get-auth-or-redirect";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const deleteInvitation = async (id: string, organizationId: string) => {
  const user = await getAuthOrRedirect();

  try {
    const invitation = await prisma.invitation.findUnique({ where: { id } });

    if (!invitation || invitation.organizationId !== organizationId) {
      return toActionState("ERROR", "Invitation not found");
    }

    if (invitation.status === "pending") {
      return toActionState("ERROR", "Cannot delete a pending invitation");
    }

    await prisma.invitation.delete({ where: { id } });
  } catch (error) {
    return fromErrorToActionState(error);
  }

  revalidatePath(`/organization/${organizationId}/invitations`);
};

export default deleteInvitation;
