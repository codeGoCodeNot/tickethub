"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { organization } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

type SelectRoleProps = {
  memberId: string;
  role: string;
};

const SelectRole = ({ memberId, role }: SelectRoleProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleChange = (value: string) => {
    startTransition(async () => {
      const { error } = await organization.updateMemberRole({
        memberId,
        role: value as "owner" | "admin" | "member",
      });
      if (error) {
        toast.error(error.message || "Failed to update role.");
        return;
      }
      toast.success("Role updated");
      router.refresh();
    });
  };

  return (
    <Select
      onValueChange={handleChange}
      defaultValue={role}
      disabled={isPending}
    >
      <SelectTrigger className="w-fit px-2 text-xs capitalize border-0 shadow-none">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="member">Member</SelectItem>
        <SelectItem value="admin">Admin</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default SelectRole;
