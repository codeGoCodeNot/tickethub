import { User } from "better-auth/types";

type Entity = {
  userId: string | null | undefined;
};

const isOwner = (
  user: User | null | undefined,
  entity: Entity | null | undefined,
) => {
  if (!user || !entity) return false;

  if (!entity.userId) return false;

  if (entity.userId !== user.id) {
    return false;
  } else {
    return true;
  }
};

export default isOwner;
