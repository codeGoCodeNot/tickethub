"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LucideTrash2 } from "lucide-react";

type MembershipMoreMenuProps = {
  onDelete: () => void;
  trigger: React.ReactNode;
};

const MembershipMoreMenu = ({ onDelete, trigger }: MembershipMoreMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent side="right">
        <DropdownMenuItem onClick={onDelete} className="text-destructive">
          <LucideTrash2 className="size-4" />
          Remove
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MembershipMoreMenu;
