"use server";

import fromErrorToActionState, {
  ActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import getAuthOrRedirect from "@/features/auth/queries/get-auth-or-redirect";
import prisma from "@/lib/prisma";
import { updateTag } from "next/cache";
import z from "zod";

const createCommentSchema = z.object({
  content: z.string().trim().min(1, "Content is required"),
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

  updateTag(`ticket-${ticketId}-comments`);
  return toActionState("SUCCESS", "Comment created");
};

export default createComment;
