"use server";

import { setCookieByKey } from "@/actions/cookies";
import fromErrorToActionState, {
  ActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import getAuthOrRedirect from "@/features/auth/queries/get-auth-or-redirect";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { signInPath } from "@/path";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const deleteAccount = async (
  _actionState: ActionState,
): Promise<ActionState> => {
  const user = await getAuthOrRedirect();

  const memberships = await prisma.member.findMany({
    where: { userId: user.id },
    include: { organization: { select: { name: true } } },
  });

  if (memberships.length > 0) {
    const list = memberships
      .map(
        (membership) =>
          `• ${membership.organization.name} (${membership.role})`,
      )
      .join("\n");
    return toActionState("ERROR", `Leave or delete these first:\n${list}`);
  }

  try {
    await auth.api.deleteUser({
      headers: await headers(),
      body: {},
    });
  } catch (error) {
    return fromErrorToActionState(error);
  }

  await setCookieByKey("toast", "Account deleted");
  redirect(signInPath());
};

export default deleteAccount;
