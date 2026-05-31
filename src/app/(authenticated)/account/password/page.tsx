import AccountTabs from "@/components/account-tabs";
import CardCompact from "@/components/card-compact";
import Heading from "@/components/heading";
import PasswordForm from "@/features/account/password/components/password-form";

const PasswordPage = () => {
  return (
    <div className="flex flex-1 flex-col gap-y-8">
      <Heading
        title="Keep your password safe"
        description="Update your account password"
        tabs={<AccountTabs />}
      />
      <CardCompact
        title="Update Password"
        description="Make sure to use a strong password that you don't use elsewhere"
        content={<PasswordForm />}
      />
    </div>
  );
};

export default PasswordPage;
