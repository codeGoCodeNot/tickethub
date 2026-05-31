import AccountTabs from "@/components/account-tabs";
import CardCompact from "@/components/card-compact";
import Heading from "@/components/heading";
import DeleteAccount from "@/features/account/profile/components/delete-account";
import ProfileForm from "@/features/account/profile/components/profile-form";
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

      <CardCompact
        title="Personal Information"
        description="Update your personal information"
        content={
          <ProfileForm
            name={user.name}
            email={user.email}
            image={user.image ?? undefined}
          />
        }
        footer={<DeleteAccount />}
      />
    </div>
  );
};

export default ProfilePage;
