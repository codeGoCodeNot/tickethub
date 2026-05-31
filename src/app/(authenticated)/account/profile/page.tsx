import AccountTabs from "@/components/account-tabs";
import Heading from "@/components/heading";
import ProfileForm from "@/features/account/components/profile-form";
import getAuthOrRedirect from "@/features/auth/queries/get-auth-or-redirect";

const ProfilePage = async () => {
  const user = await getAuthOrRedirect();

  return (
    <div className="flex flex-1 flex-col gap-y-8">
      <Heading
        title="Manage your profile"
        description="Update your account information"
        tabs={<AccountTabs />}
      />

      <ProfileForm
        name={user.name}
        email={user.email}
        image={user.image ?? undefined}
      />
    </div>
  );
};

export default ProfilePage;
