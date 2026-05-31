import { createAuthClient } from "better-auth/react";
import { emailOTPClient, organizationClient } from "better-auth/client/plugins";

export const {
  signIn,
  signUp,
  signOut,
  getSession,
  useSession,
  emailOtp,
  organization,
  useListOrganizations,
  useActiveOrganization,
  updateUser,
  changeEmail,
} = createAuthClient({
  plugins: [emailOTPClient(), organizationClient()],
});
