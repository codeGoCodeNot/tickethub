import { SearchParams } from "nuqs/server";
import AcceptInvitationCard from "@/features/invitations/components/accept-invitation-card";
import { redirect } from "next/navigation";
import { organizationPath } from "@/path";

type AcceptInvitationPageProps = {
  searchParams: Promise<SearchParams>;
};

const AcceptInvitationPage = async ({
  searchParams,
}: AcceptInvitationPageProps) => {
  const { id } = await searchParams;
  if (!id || typeof id !== "string") redirect(organizationPath());

  return <AcceptInvitationCard invitationId={id} />;
};

export default AcceptInvitationPage;
