"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LucideArrowLeftRight, LucideLogOut, LucideTrash2 } from "lucide-react";

type OrganizationMoreMenuProps = {
  isActive: boolean;
  onSwitch: () => Promise<void>;
  onDelete: () => void;
  onLeave: () => void;
  trigger: React.ReactNode;
  limitedAccess?: boolean;
};

const OrganizationMoreMenu = ({
  isActive,
  onSwitch,
  onDelete,
  onLeave,
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
          <DropdownMenuItem onClick={onLeave}>
            <LucideLogOut className="size-4" />
            Leave
          </DropdownMenuItem>
        )}
        {!limitedAccess && (
          <DropdownMenuItem onClick={onDelete} className="text-destructive">
            <LucideTrash2 className="size-4" />
            Delete
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default OrganizationMoreMenu;
