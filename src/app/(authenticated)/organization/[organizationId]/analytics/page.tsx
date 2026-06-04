import Heading from "@/components/heading";
import getAuthOrRedirect from "@/features/auth/queries/get-auth-or-redirect";
import isOwnerOrAdmin from "@/features/auth/utils/is-owner-or-admin";
import AnalyticsDashboard from "@/features/analytics/components/analytics-dashboard";
import { connection } from "next/server";
import getAnalytics from "@/features/analytics/queries/get-analytics";
import { pricingPath } from "@/path";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

type AnalyticsPageProps = {
  params: Promise<{ organizationId: string }>;
};

const AnalyticsPage = async ({ params }: AnalyticsPageProps) => {
  await connection();
  const { organizationId } = await params;
  const user = await getAuthOrRedirect();
  await isOwnerOrAdmin(user.id, organizationId);
  const analytics = await getAnalytics(organizationId);
  const stripeCustomer = await prisma.stripeCustomer.findUnique({
    where: { organizationId },
  });

  if (stripeCustomer?.subscriptionStatus !== "active") {
    redirect(pricingPath());
  }

  return (
    <div className="flex flex-col flex-1 gap-y-8">
      <Heading
        title="Analytics"
        description="View analytics for your organization"
      />
      <AnalyticsDashboard {...analytics} />
    </div>
  );
};

export default AnalyticsPage;
