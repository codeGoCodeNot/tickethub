import CardCompact from "@/components/card-compact";
import Heading from "@/components/heading";
import OrganizationCreateForm from "@/features/organizations/components/organization-create-form";

const OrganizationCreatePage = () => {
  return (
    <div className="flex flex-col flex-1 gap-y-8">
      <Heading
        title="Create Organization"
        description="Create a new organization for your team."
      />
      <div className="flex flex-1 flex-col justify-center items-center">
        <CardCompact
          title="Create Organization"
          description="Create an Organization to get started"
          content={<OrganizationCreateForm />}
        />
      </div>
    </div>
  );
};

export default OrganizationCreatePage;
