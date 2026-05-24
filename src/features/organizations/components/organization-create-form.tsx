"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  organization,
  useActiveOrganization,
  useListOrganizations,
} from "@/lib/auth-client";
import { LucideLoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";

type OrganizationCreateFormProps = {
  onSuccess: () => void;
};

const OrganizationCreateForm = ({ onSuccess }: OrganizationCreateFormProps) => {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const { refetch: refetchOrgs } = useListOrganizations();
  const { refetch: refetchActive } = useActiveOrganization();
  const router = useRouter();

  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name = new FormData(e.currentTarget).get("name") as string;
    if (!name || name.length < 3) {
      setError("Organization name must be at least 3 characters");
      return;
    }
    setIsPending(true);
    const { data: org, error } = await organization.create({
      name,
      slug: name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
        .replace(/-+/g, "-"),
    });
    if (error || !org) {
      setError(error?.message ?? "Something went wrong");
      setIsPending(false);
      return;
    }
    await organization.setActive({ organizationId: org.id });
    await Promise.all([refetchOrgs(), refetchActive()]);
    formRef.current?.reset();
    setIsPending(false);
    toast.success("Organization created");
    onSuccess();
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} ref={formRef}>
      <div className="flex flex-col gap-y-1">
        <Input name="name" placeholder="Organization Name" />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending && <LucideLoaderCircle className="animate-spin" />}
          Create Organization
        </Button>
      </div>
    </form>
  );
};

export default OrganizationCreateForm;
