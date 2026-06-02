"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  organization,
  useActiveOrganization,
  useListOrganizations,
  useSession,
} from "@/lib/auth-client";
import { LucideLoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";
import triggerOrgCreated from "../actions/trigger-org-created";

type OrganizationCreateFormProps = {
  onSuccess: () => void;
  existingOrg?: { id: string; name: string };
};

const OrganizationCreateForm = ({
  onSuccess,
  existingOrg,
}: OrganizationCreateFormProps) => {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const { refetch: refetchOrgs } = useListOrganizations();
  const { refetch: refetchActive } = useActiveOrganization();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const { data: session } = useSession();

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name = new FormData(e.currentTarget).get("name") as string;
    if (!name || name.length < 3) {
      setError("Organization name must be at least 3 characters");
      return;
    }
    const slug = name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-");

    setIsPending(true);

    if (existingOrg) {
      const { error } = await organization.update({
        organizationId: existingOrg.id,
        data: { name, slug },
      });
      if (error) {
        setError(error.message ?? "Something went wrong");
        setIsPending(false);
        return;
      }
      toast.success("Organization updated");
    } else {
      const { data: org, error } = await organization.create({ name, slug });
      if (error || !org) {
        setError(error?.message ?? "Something went wrong");
        setIsPending(false);
        return;
      }

      await triggerOrgCreated(org.id, session?.user.email ?? "");
      await organization.setActive({ organizationId: org.id });
      await Promise.all([refetchOrgs(), refetchActive()]);
      formRef.current?.reset();
      toast.success("Organization created");
    }

    setIsPending(false);
    onSuccess();
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} ref={formRef}>
      <div className="flex flex-col gap-y-1">
        <Input
          name="name"
          placeholder="Organization Name"
          defaultValue={existingOrg?.name ?? ""}
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending && <LucideLoaderCircle className="animate-spin" />}
          {existingOrg ? "Update Organization" : "Create Organization"}
        </Button>
      </div>
    </form>
  );
};

export default OrganizationCreateForm;
