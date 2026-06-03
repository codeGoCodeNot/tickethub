import Placeholder from "@/components/placeholder";
import getActiveOrganization from "@/features/organizations/queries/get-active-organization";
import Products from "@/features/stripe/components/products";

const PricingPage = async () => {
  const organizationId = await getActiveOrganization();

  if (!organizationId)
    return (
      <Placeholder
        label="Please select an organization to view pricing."
        button={null}
        icon={null}
      />
    );

  return <Products organizationId={organizationId} />;
};

export default PricingPage;
