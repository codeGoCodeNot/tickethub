import Heading from "@/components/heading";
import Spinner from "@/components/spinner";
import getOrgOwnerOrRedirect from "@/features/members/queries/get-org-owner-or-redirect";
import CustomerPortalForm from "@/features/stripe/components/customer-portal-form";
import Products from "@/features/stripe/components/products";
import { LucideSettings } from "lucide-react";
import { Suspense } from "react";

type SubscriptionPageProps = {
  params: Promise<{ organizationId: string }>;
};

const SubscriptionPage = async ({ params }: SubscriptionPageProps) => {
  const { organizationId } = await params;
  await getOrgOwnerOrRedirect(organizationId);

  return (
    <div className="flex flex-col flex-1 gap-y-8">
      <Heading
        title="Subscription"
        description="Manage your subscription"
        actions={
          <CustomerPortalForm organizationId={organizationId}>
            <>
              <LucideSettings />
              <span>Manage Subscription</span>
            </>
          </CustomerPortalForm>
        }
      />
      <Suspense fallback={<Spinner />}>
        <Products organizationId={organizationId} />
      </Suspense>
    </div>
  );
};

export default SubscriptionPage;
