"use server";

import fromErrorToActionState, {
  ActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { auth } from "@/lib/auth";
import { forgotPasswordRateLimit } from "@/lib/rate-limit";
import { getIp } from "@/utils/get-ip";
import z from "zod";

const passwordForgotSchema = z.object({
  email: z.email({ message: "Please enter a valid email" }),
});

const forgotPassword = async (
  _actionState: ActionState,
  formData: FormData,
) => {
  const ip = await getIp();
  const { success, reset } = await forgotPasswordRateLimit.limit(ip);

  if (!success) {
    const resetIn = Math.ceil((reset - Date.now()) / 1000 / 60);
    return toActionState(
      "ERROR",
      `Too many attempts. Please try again in ${resetIn} minutes.`,
    );
  }

  try {
    const { email } = passwordForgotSchema.parse(
      Object.fromEntries(formData.entries()),
    );

    await auth.api.requestPasswordReset({
      body: {
        email,
        redirectTo: "https://tickethub.johnsenb.dev/reset-password",
      },
    });
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }
  return toActionState(
    "SUCCESS",
    "If an account with that email exists, we sent a reset link to it.",
  );
};

export default forgotPassword;
