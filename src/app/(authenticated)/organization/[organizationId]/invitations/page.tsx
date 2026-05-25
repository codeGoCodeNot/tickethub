import Heading from "@/components/heading";
import Spinner from "@/components/spinner";
import InvitationDialog from "@/features/invitations/components/invitation-dialog";
import InvitationList from "@/features/invitations/components/invitation-list";
import getOrgOwnerOrRedirect from "@/features/members/queries/get-org-owner-or-redirect";
import { Suspense } from "react";

type InvitationsPageProps = {
  params: Promise<{ organizationId: string }>;
};

const InvitationsPage = ({ params }: InvitationsPageProps) => {
  return (
    <div className="flex flex-col flex-1 gap-y-8">
      <Suspense fallback={<Spinner />}>
        <InvitationsContent params={params} />
      </Suspense>
    </div>
  );
};

const InvitationsContent = async ({ params }: InvitationsPageProps) => {
  const { organizationId } = await params;
  await getOrgOwnerOrRedirect(organizationId);
  return (
    <>
      <Heading
        title="Invitations"
        description="Manage your organization's invitations"
        actions={<InvitationDialog organizationId={organizationId} />}
      />
      <InvitationList organizationId={organizationId} />
    </>
  );
};

export default InvitationsPage;
