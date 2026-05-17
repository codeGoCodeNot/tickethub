import { signIn } from "@/lib/auth-client";
import { ticketsPath } from "@/path";

const signInAction = async (email: string, password: string) => {
  const { error } = await signIn.email({
    email,
    password,
    callbackURL: ticketsPath(),
  });

  return { error };
};

export default signInAction;
