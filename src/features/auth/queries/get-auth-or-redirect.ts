import { redirect } from "next/navigation";
import { getAuth } from "./get-auth";
import { signInPath, verifyEmailPath } from "@/path";

const getAuthOrRedirect = async () => {
  const user = await getAuth();

  if (!user) redirect(signInPath());
  if (!user.emailVerified) redirect(verifyEmailPath());

  return user;
};

export default getAuthOrRedirect;
