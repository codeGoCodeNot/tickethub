import Heading from "@/components/heading";
import Spinner from "@/components/spinner";
import ActivityLogList from "@/features/activity-logs/components/activity-log-list";
import { activityLogSearchParamsCache } from "@/features/activity-logs/search-params";
import getAuthOrRedirect from "@/features/auth/queries/get-auth-or-redirect";
import isOwnerOrAdmin from "@/features/auth/utils/is-owner-or-admin";
import { connection } from "next/server";
import { SearchParams } from "nuqs/server";
import { Suspense } from "react";

type ActivityLogPageProps = {
  params: Promise<{ organizationId: string }>;
  searchParams: Promise<SearchParams>;
};

const ActivityLogPage = async ({
  params,
  searchParams,
}: ActivityLogPageProps) => {
  await connection();
  const { organizationId } = await params;
  await getAuthOrRedirect();
  const { page, size } = activityLogSearchParamsCache.parse(await searchParams);
  const user = await getAuthOrRedirect();
  const adminOrOwner = await isOwnerOrAdmin(user.id, organizationId);

  return (
    <div className="flex flex-col flex-1 gap-y-8">
      <Heading
        title="Activity Log"
        description="View activity logs for your organization"
      />
      <Suspense key={`${page}-${size}`} fallback={<Spinner />}>
        <ActivityLogList
          organizationId={organizationId}
          page={page}
          size={size}
          isOwnerOrAdmin={adminOrOwner}
          userId={user.id}
        />
      </Suspense>
    </div>
  );
};

export default ActivityLogPage;
