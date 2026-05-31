import { signIn } from "@/lib/auth-client";
import { homePath } from "@/path";

const signInAction = async (email: string, password: string) => {
  const { error } = await signIn.email({
    email,
    password,
    callbackURL: homePath(),
  });

  return { error };
};

export default signInAction;
