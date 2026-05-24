"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LucideArrowLeftRight, LucideTrash2 } from "lucide-react";

type OrganizationMoreMenuProps = {
  isActive: boolean;
  onSwitch: () => Promise<void>;
  onDelete: () => void;
  trigger: React.ReactNode;
  limitedAccess?: boolean;
};

const OrganizationMoreMenu = ({
  isActive,
  onSwitch,
  onDelete,
  trigger,
  limitedAccess,
}: OrganizationMoreMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent side="right">
        <DropdownMenuItem disabled={isActive} onClick={onSwitch}>
          <LucideArrowLeftRight className="size-4" />
          {isActive ? "Active" : "Activate"}
        </DropdownMenuItem>
        {!limitedAccess && (
          <DropdownMenuItem onClick={onDelete}>
            <LucideTrash2 className="text-red-500" />
            Delete
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default OrganizationMoreMenu;
