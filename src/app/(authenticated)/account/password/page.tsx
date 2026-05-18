import AccountTabs from "@/components/account-tabs";
import Heading from "@/components/heading";

const PasswordPage = () => {
  return (
    <div className="flex flex-1 flex-col gap-y-8">
      <Heading
        title="Keep your password safe"
        description="Update your account password"
        tabs={<AccountTabs />}
      />
    </div>
  );
};

export default PasswordPage;
