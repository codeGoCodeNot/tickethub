import { createAuthClient } from "better-auth/react";
import { emailOTPClient, organizationClient } from "better-auth/client/plugins";

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  emailOtp,
  organization,
  useListOrganizations,
  useActiveOrganization,
  updateUser,
} = createAuthClient({
  plugins: [emailOTPClient(), organizationClient()],
});
