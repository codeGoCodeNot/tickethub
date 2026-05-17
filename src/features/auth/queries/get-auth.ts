import getSession from "@/lib/get-session";
import { cache } from "react";

export const getAuth = cache(async () => {
  const session = await getSession();

  return session?.user || null;
});
