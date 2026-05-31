"use server";

import fromErrorToActionState, {
  toActionState,
} from "@/components/form/utils/to-action-state";
import getAuthOrRedirect from "@/features/auth/queries/get-auth-or-redirect";
import { auth } from "@/lib/auth";
import { emailOtpRateLimit } from "@/lib/rate-limit";
import { headers } from "next/headers";

const requestEmailChange = async (newEmail: string) => {
  const user = await getAuthOrRedirect();

  const { success } = await emailOtpRateLimit.limit(`change-email:${user.id}`);
  if (!success) {
    return toActionState("ERROR", "Too many attempts. Try again later.");
  }

  try {
    await auth.api.requestEmailChangeEmailOTP({
      headers: await headers(),
      body: { newEmail },
    });
  } catch (error) {
    return fromErrorToActionState(error);
  }
  return toActionState("SUCCESS", "Code sent.");
};

export default requestEmailChange;
