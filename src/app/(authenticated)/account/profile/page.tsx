import AccountTabs from "@/components/account-tabs";
import Heading from "@/components/heading";
import DeleteAccount from "@/features/account/components/delete-account";
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
      <div className="px-8 max-w-lg flex flex-col gap-y-4 mx-auto">
        <ProfileForm
          name={user.name}
          email={user.email}
          image={user.image ?? undefined}
        />
        <DeleteAccount />
      </div>
    </div>
  );
};

export default ProfilePage;
