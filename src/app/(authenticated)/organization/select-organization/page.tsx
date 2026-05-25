import Heading from "@/components/heading";
import Spinner from "@/components/spinner";
import OrganizationDialog from "@/features/organizations/components/organization-dialog";
import OrganizationList from "@/features/organizations/components/organization-list";
import { Suspense } from "react";

const SelectOrganizationPage = () => {
  return (
    <div className="flex flex-col flex-1 gap-y-8">
      <Heading
        title="Select Organizations"
        description="Choose an organization to manage"
        actions={<OrganizationDialog />}
      />
      <Suspense fallback={<Spinner />}>
        <OrganizationList limitedAccess />
      </Suspense>
    </div>
  );
};

export default SelectOrganizationPage;
