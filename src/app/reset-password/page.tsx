import CardCompact from "@/components/card-compact";
import PasswordResetForm from "@/features/password/components/password-reset-form";
import { Suspense } from "react";

type ResetPasswordPageProps = {
  searchParams: Promise<{ token?: string }>;
};

const ResetPasswordContent = async ({
  searchParams,
}: ResetPasswordPageProps) => {
  const { token } = await searchParams;

  return (
    <div className="flex flex-col flex-1 items-center justify-center px-4">
      <CardCompact
        title="Reset Password"
        description="Enter your new password below"
        className="w-full max-w-[420px] animate-fade-from-top"
        content={<PasswordResetForm token={token ?? ""} />}
      />
    </div>
  );
};

const ResetPasswordPage = ({ searchParams }: ResetPasswordPageProps) => {
  return (
    <Suspense>
      <ResetPasswordContent searchParams={searchParams} />
    </Suspense>
  );
};

export default ResetPasswordPage;
