import CardCompact from "@/components/card-compact";
import Heading from "@/components/heading";
import VerifyEmailForm from "@/features/email/components/verify-email-form";
import { Suspense } from "react";

type VerifyEmailPageProps = { searchParams: Promise<{ email?: string }> };

const VerifyEmailContent = async ({ searchParams }: VerifyEmailPageProps) => {
  const { email } = await searchParams;

  return (
    <div className="flex flex-col flex-1 gap-y-8">
      <Heading
        title="Verify Your Email"
        description="Verify your email to start using our service"
      />
      <div className="flex flex-col flex-1 items-center justify-center">
        <CardCompact
          title="Verify your Email"
          description="Verify your email to start"
          content={<VerifyEmailForm email={email ?? ""} />}
        />
      </div>
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
