"use server";

import fromErrorToActionState, {
  toActionState,
} from "@/components/form/utils/to-action-state";
import { getAuth } from "@/features/auth/queries/get-auth";
import isOwner from "@/features/auth/utils/is-owner";
import prisma from "@/lib/prisma";
import { updateTag } from "next/cache";

const deleteAttachment = async (id: string) => {
  const user = await getAuth();

  const attachment = await prisma.attachment.findUnique({
    where: { id },
    include: { ticket: true },
  });

  if (!isOwner(user, attachment?.ticket))
    return toActionState(
      "ERROR",
      "You are not authorized to delete this attachment.",
    );

  try {
    await prisma.attachment.delete({
      where: { id },
    });
  } catch (error) {
    return fromErrorToActionState(error);
  }

  updateTag(`ticket-${attachment?.ticketId}-attachments`);
  return toActionState("SUCCESS", "Attachment deleted.");
};

export default deleteAttachment;
