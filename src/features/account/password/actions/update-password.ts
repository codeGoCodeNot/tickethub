"use server";

import fromErrorToActionState, {
  ActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import getAuthOrRedirect from "@/features/auth/queries/get-auth-or-redirect";
import { auth } from "@/lib/auth";
import { passwordSchema } from "@/lib/validation";
import { passwordPath } from "@/path";
import { APIError } from "better-auth/api";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import z from "zod";

const updatePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, { message: "Please confirm password" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const updatePassword = async (
  _actionState: ActionState,
  formData: FormData,
) => {
  await getAuthOrRedirect();

  try {
    const { currentPassword, newPassword } = updatePasswordSchema.parse(
      Object.fromEntries(formData.entries()),
    );

    await auth.api.changePassword({
      headers: await headers(),
      body: {
        currentPassword,
        newPassword,
        // revokeOtherSessions: true,
      },
    });
  } catch (error) {
    if (error instanceof APIError) {
      return toActionState("ERROR", "Incorrect current password", formData, {
        currentPassword: ["Incorrect current password"],
      });
    }
    return fromErrorToActionState(error, formData);
  }

  revalidatePath(passwordPath());
  return toActionState("SUCCESS", "Password updated");
};

export default updatePassword;
