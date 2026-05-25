import getSession from "@/lib/get-session";
import { cache } from "react";

const getActiveOrganization = cache(async () => {
  const session = await getSession();
  return session?.session.activeOrganizationId ?? null;
});

export default getActiveOrganization;
