import { Prisma } from "@/generated/prisma/client";

export type CommentWithMetadata = Prisma.CommentGetPayload<{
  include: {
    user: {
      select: {
        name: true;
        image: true;
      };
    };
  };
}>;
