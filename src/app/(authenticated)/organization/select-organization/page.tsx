import Heading from "@/components/heading";
import Spinner from "@/components/spinner";
import OrganizationCreateDialog from "@/features/organizations/components/organization-create-dialog";
import OrganizationList from "@/features/organizations/components/organization-list";
import { Suspense } from "react";

const SelectOrganizationPage = () => {
  return (
    <div className="flex flex-col flex-1 gap-y-8">
      <Heading
        title="Select Organizations"
        description="Choose an organization to manage"
        actions={<OrganizationCreateDialog />}
      />
      <Suspense fallback={<Spinner />}>
        <OrganizationList limitedAccess />
      </Suspense>
    </div>
  );
};

export default SelectOrganizationPage;
