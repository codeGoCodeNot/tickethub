import { redirect } from "next/navigation";
import { getAuth } from "./get-auth";
import { signInPath } from "@/path";

const getAuthOrRedirect = async () => {
  const user = await getAuth();

  if (!user) redirect(signInPath());
};

export default getAuthOrRedirect;
