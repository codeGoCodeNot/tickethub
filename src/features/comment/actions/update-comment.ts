"use server";

import fromErrorToActionState, {
  ActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import getAuthOrRedirect from "@/features/auth/queries/get-auth-or-redirect";
import isOwner from "@/features/auth/utils/is-owner";
import prisma from "@/lib/prisma";
import { updateTag } from "next/cache";
import z from "zod";

const updateCommentSchema = z.object({
  content: z.string().trim().min(3, "Content is required"),
});

const updateComment = async (
  id: string,
  _actionState: ActionState,
  formData: FormData,
) => {
  const user = await getAuthOrRedirect();

  const existingComment = await prisma.comment.findUnique({ where: { id } });

  if (!existingComment || !isOwner(user, existingComment)) {
    return toActionState("ERROR", "Not authorized");
  }

  try {
    const { content } = updateCommentSchema.parse(
      Object.fromEntries(formData.entries()),
    );

    await prisma.comment.update({
      where: {
        id,
      },
      data: {
        content,
      },
    });
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }

  updateTag(`ticket-${existingComment.ticketId}-comments`);
  return toActionState("SUCCESS", "Comment updated");
};

export default updateComment;
