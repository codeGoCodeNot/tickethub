"use server";

import { setCookieByKey } from "@/actions/cookies";
import fromErrorToActionState, {
  ActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { auth } from "@/lib/auth";
import { passwordSchema } from "@/lib/validation";
import { signInPath } from "@/path";
import { redirect } from "next/navigation";
import z from "zod";

const passwordResetSchema = z.object({
  newPassword: passwordSchema,
  confirmPassword: passwordSchema,
  token: z.string(),
});

const passwordReset = async (_actionState: ActionState, formData: FormData) => {
  try {
    const { newPassword, confirmPassword, token } = passwordResetSchema.parse(
      Object.fromEntries(formData.entries()),
    );

    if (newPassword !== confirmPassword) {
      return toActionState("ERROR", "Passwords do not match", formData);
    }

    await auth.api.resetPassword({
      body: {
        newPassword,
        token,
      },
    });
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }

  await setCookieByKey("toast", "Password reset successful.");
  redirect(signInPath());
};

export default passwordReset;
