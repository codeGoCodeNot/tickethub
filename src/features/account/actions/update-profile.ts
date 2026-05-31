"use server";

import fromErrorToActionState, {
  ActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { auth } from "@/lib/auth";
import { profilePath } from "@/path";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import z from "zod";

const updateProfileSchema = z.object({
  name: z.string(),
  image: z.string().optional(),
  email: z.email("Invalid email address"),
});

const updateProfile = async (_actionState: ActionState, formData: FormData) => {
  try {
    const { name, image, email } = updateProfileSchema.parse(
      Object.fromEntries(formData.entries()),
    );

    await auth.api.updateUser({
      headers: await headers(),
      body: {
        name,
        image,
      },
    });
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }

  revalidatePath(profilePath());
  return toActionState("SUCCESS", "Profile updated");
};

export default updateProfile;
