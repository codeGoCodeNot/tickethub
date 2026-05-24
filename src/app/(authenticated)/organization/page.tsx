import Heading from "@/components/heading";
import OrganizationCreateDialog from "@/features/organizations/components/organization-create-dialog";
import OrganizationList from "@/features/organizations/components/organization-list";
import { Suspense } from "react";

const OrganizationPage = () => {
  return (
    <div className="flex flex-col flex-1 gap-y-8">
      <Heading
        title="Organizations"
        description="Manage your organizations"
        actions={<OrganizationCreateDialog />}
      />
      <Suspense>
        <OrganizationList />
      </Suspense>
    </div>
  );
};

export default OrganizationPage;
