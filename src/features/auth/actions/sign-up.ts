"use server";

import { setCookieByKey } from "@/actions/cookies";
import fromErrorToActionState, {
  ActionState,
} from "@/components/form/utils/to-action-state";
import { auth } from "@/lib/auth";
import { inngest } from "@/lib/inngest";
import { passwordSchema } from "@/lib/validation";
import { signInPath } from "@/path";
import { redirect } from "next/navigation";
import z from "zod";

const signUpSchema = z
  .object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.email({ message: "Please enter a valid email" }),
    password: passwordSchema,
    confirmPassword: z.string().min(1, { message: "Please confirm password" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const signUp = async (_actionState: ActionState, formData: FormData) => {
  try {
    const { name, email, password } = signUpSchema.parse(
      Object.fromEntries(formData.entries()),
    );

    await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
      },
    });

    void inngest.send({
      name: "app/welcome",
      data: {
        email,
        name,
      },
    });
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }

  await setCookieByKey("toast", "Account created successfully.");
  redirect(signInPath());
};

export default signUp;
