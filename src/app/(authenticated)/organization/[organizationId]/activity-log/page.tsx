import Heading from "@/components/heading";
import Spinner from "@/components/spinner";
import ActivityLogList from "@/features/activity-logs/components/activity-log-list";
import getAuthOrRedirect from "@/features/auth/queries/get-auth-or-redirect";
import { Suspense } from "react";

type ActivityLogPageProps = {
  params: Promise<{ organizationId: string }>;
};

const ActivityLogPage = async ({ params }: ActivityLogPageProps) => {
  const { organizationId } = await params;
  await getAuthOrRedirect();

  return (
    <div className="flex flex-col flex-1 gap-y-8">
      <Heading
        title="Activity Log"
        description="View activity logs for your organization"
      />
      <Suspense fallback={<Spinner />}>
        <ActivityLogList organizationId={organizationId} />
      </Suspense>
    </div>
  );
};

export default ActivityLogPage;
