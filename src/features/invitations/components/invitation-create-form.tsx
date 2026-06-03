"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { organization } from "@/lib/auth-client";
import { LucideLoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";

type InvitationCreateFormProps = {
  organizationId: string;
  onSuccess: () => void;
  allowedTeamMembers: number;
  currentTeamMembers: number;
};

const InvitationCreateForm = ({
  organizationId,
  onSuccess,
  allowedTeamMembers,
  currentTeamMembers,
}: InvitationCreateFormProps) => {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [role, setRole] = useState("member");
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (currentTeamMembers >= allowedTeamMembers) {
      setError("Team member limit reached. Upgrade your plan to invite more.");
      return;
    }

    const email = new FormData(e.currentTarget).get("email") as string;
    if (!email) {
      setError("Email is required");
      return;
    }
    setIsPending(true);
    const { error } = await organization.inviteMember({
      email,
      role: role as "member" | "admin",
      organizationId,
    });
    if (error) {
      setError(error.message ?? "Something went wrong");
      setIsPending(false);
      return;
    }
    toast.success("Invitation sent");
    formRef.current?.reset();
    setIsPending(false);
    onSuccess();
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} ref={formRef}>
      <div className="flex flex-col gap-y-2">
        <Input name="email" type="email" placeholder="Email address" />
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="member">Member</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending && <LucideLoaderCircle className="animate-spin" />}
          Send Invitation
        </Button>
      </div>
    </form>
  );
};

export default InvitationCreateForm;
