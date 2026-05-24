"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LucideArrowLeftRight } from "lucide-react";

type OrganizationMoreMenuProps = {
  isActive: boolean;
  onSwitch: () => Promise<void>;
  trigger: React.ReactNode;
};

const OrganizationMoreMenu = ({
  isActive,
  onSwitch,
  trigger,
}: OrganizationMoreMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent side="right">
        <DropdownMenuItem disabled={isActive} onClick={onSwitch}>
          <LucideArrowLeftRight className="size-4" />
          {isActive ? "Active" : "Activate"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default OrganizationMoreMenu;
