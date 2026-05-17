import getSession from "@/lib/get-session";

export const getAuth = async () => {
  const session = await getSession();

  return session?.user || null;
};
