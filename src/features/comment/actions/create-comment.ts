"use server";

import fromErrorToActionState, {
  ActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import getAuthOrRedirect from "@/features/auth/queries/get-auth-or-redirect";
import prisma from "@/lib/prisma";
import { ticketPath } from "@/path";
import { revalidatePath, revalidateTag } from "next/cache";
import z from "zod";

const createCommentSchema = z.object({
  content: z.string().trim().min(3, "Content is required"),
});

const createComment = async (
  ticketId: string,
  _actionState: ActionState,
  formData: FormData,
) => {
  const user = await getAuthOrRedirect();

  try {
    const { content } = createCommentSchema.parse(
      Object.fromEntries(formData.entries()),
    );

    await prisma.comment.create({
      data: {
        userId: user.id,
        ticketId,
        content,
      },
    });
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }

  revalidateTag(`ticket-${ticketId}-comments`, { expire: 0 });
  revalidatePath(ticketPath(ticketId));
  return toActionState("SUCCESS", "Comment created");
};

export default createComment;
