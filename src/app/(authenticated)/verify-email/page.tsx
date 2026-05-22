import CardCompact from "@/components/card-compact";
import Heading from "@/components/heading";
import { getAuth } from "@/features/auth/queries/get-auth";
import VerifyEmailForm from "@/features/email/components/verify-email-form";
import { ticketsPath } from "@/path";
import { redirect } from "next/navigation";
import { Suspense } from "react";

type VerifyEmailPageProps = { searchParams: Promise<{ email?: string }> };

const VerifyEmailContent = async ({ searchParams }: VerifyEmailPageProps) => {
  const { email } = await searchParams;
  const user = await getAuth();

  if (user?.emailVerified) redirect(ticketsPath());

  return (
    <div className="flex flex-col flex-1 items-center justify-center">
      <CardCompact
        title="Verify your Email"
        description="Verify your email to start"
        content={<VerifyEmailForm email={email ?? ""} />}
      />
    </div>
  );
};

const VerifyEmailPage = ({ searchParams }: VerifyEmailPageProps) => {
  return (
    <Suspense>
      <VerifyEmailContent searchParams={searchParams} />
    </Suspense>
  );
};

export default VerifyEmailPage;
