"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { organization } from "@/lib/auth-client";
import { LucideArrowLeftRight, LucideLoaderCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type OrganizationMoreMenuProps = {
  id: string;
  name: string;
  isActive: boolean;
  onSwitch: () => void;
  trigger: React.ReactNode;
};

const OrganizationMoreMenu = ({
  id,
  name,
  isActive,
  onSwitch,
  trigger,
}: OrganizationMoreMenuProps) => {
  const [isPending, setIsPending] = useState(false);

  const handleSwitch = async () => {
    if (isActive) return;
    onSwitch();
    setIsPending(true);
    await organization.setActive({ organizationId: id });
    toast.success(`Switched to ${name}`);
    setIsPending(false);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent side="right">
        <DropdownMenuItem
          disabled={isActive || isPending}
          onClick={handleSwitch}
        >
          {isPending ? (
            <LucideLoaderCircle className="size-4 animate-spin" />
          ) : (
            <LucideArrowLeftRight className="size-4" />
          )}
          {isActive ? "Active" : "Activate"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default OrganizationMoreMenu;
