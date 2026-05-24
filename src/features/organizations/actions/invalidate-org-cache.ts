"use server";

import { getAuth } from "@/features/auth/queries/get-auth";
import { redis } from "@/lib/redis";

export const invalidateOrgCache = async () => {
  const user = await getAuth();
  if (user?.id) await redis.del(`has-org:${user.id}`);
};
