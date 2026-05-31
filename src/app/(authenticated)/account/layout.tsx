import getAuthOrRedirect from "@/features/auth/queries/get-auth-or-redirect";
import { Suspense } from "react";

const AccountLayout = async ({ children }: { children: React.ReactNode }) => {
  await getAuthOrRedirect();
  return <Suspense>{children}</Suspense>;
};

export default AccountLayout;
