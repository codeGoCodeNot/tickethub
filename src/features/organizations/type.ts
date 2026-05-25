import { Prisma } from "@/generated/prisma/client";

export type OrganizationWithMetadata = Prisma.OrganizationGetPayload<{
  include: {
    members: true;
    _count: {
      select: {
        members: true;
      };
    };
  };
}> & {
  membershipByUser: Prisma.MemberGetPayload<object>;
};
