import Heading from "@/components/heading";
import Spinner from "@/components/spinner";
import MembershipList from "@/features/members/components/membership-list";
import getOrgOwnerOrRedirect from "@/features/members/queries/get-org-owner-or-redirect";
import OrganizationCreateDialog from "@/features/organizations/components/organization-create-dialog";
import { Suspense } from "react";

type MembershipsPageProps = {
  params: Promise<{ organizationId: string }>;
};

const MembershipsPage = ({ params }: MembershipsPageProps) => {
  return (
    <div className="flex flex-col flex-1 gap-y-8">
      <Heading
        title="Memberships"
        description="Manage your organization memberships"
        actions={<OrganizationCreateDialog />}
      />
      <Suspense fallback={<Spinner />}>
        <MembershipsContent params={params} />
      </Suspense>
    </div>
  );
};

const MembershipsContent = async ({ params }: MembershipsPageProps) => {
  const { organizationId } = await params;
  await getOrgOwnerOrRedirect(organizationId);
  return <MembershipList organizationId={organizationId} />;
};

export default MembershipsPage;
