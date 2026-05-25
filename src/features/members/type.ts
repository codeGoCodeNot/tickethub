import { Prisma } from "@/generated/prisma/client";

export type MemberWithUser = Prisma.MemberGetPayload<{
  include: {
    user: {
      select: {
        name: true;
        email: true;
        emailVerified: true;
      };
    };
  };
}>;
