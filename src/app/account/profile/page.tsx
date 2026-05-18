import AccountTabs from "@/components/account-tabs";
import Heading from "@/components/heading";

const ProfilePage = () => {
  return (
    <div className="flex flex-1 flex-col gap-y-8">
      <Heading
        title="Manage your profile"
        description="Update your account information"
        tabs={<AccountTabs />}
      />
    </div>
  );
};

export default ProfilePage;
