"use server";

import fromErrorToActionState, {
  toActionState,
} from "@/components/form/utils/to-action-state";
import getAuthOrRedirect from "@/features/auth/queries/get-auth-or-redirect";
import isOwner from "@/features/auth/utils/is-owner";
import prisma from "@/lib/prisma";
import { updateTag } from "next/cache";

const deleteComment = async (id: string) => {
  const user = await getAuthOrRedirect();

  const existingComment = await prisma.comment.findUnique({
    where: {
      id,
    },
  });

  if (!existingComment || !isOwner(user, existingComment)) {
    return toActionState("ERROR", "Not authorized to delete this comment");
  }
  try {
    await prisma.comment.delete({
      where: { id },
    });
  } catch (error) {
    return fromErrorToActionState(error);
  }

  updateTag(`ticket-${existingComment.ticketId}-comments`);

  return toActionState("SUCCESS", "Comment deleted");
};

export default deleteComment;
