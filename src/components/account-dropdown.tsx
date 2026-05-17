import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SignOutItem from "@/features/auth/components/sign-out-item";

import { User } from "better-auth/types";

const gradients = [
  "135deg,#f59e0b,#ef4444",
  "135deg,#06b6d4,#6366f1",
  "135deg,#10b981,#3b82f6",
  "135deg,#8b5cf6,#ec4899",
  "135deg,#f97316,#eab308",
  "135deg,#14b8a6,#6366f1",
];

const avatarGradient = (name: string) => {
  const i =
    [...name].reduce((acc, c) => acc + c.charCodeAt(0), 0) % gradients.length;
  return `linear-gradient(${gradients[i]})`;
};
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

type AccountDropdownProps = {
  user: User;
};

const AccountDropdown = ({ user }: AccountDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="cursor-pointer">
        <Avatar>
          <AvatarImage
            src={user.image ?? undefined}
            alt={user.name || "User Avatar"}
          />
          <AvatarFallback
            style={{ background: avatarGradient(user.name ?? "") }}
          >
            {user.name?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="center"
        sideOffset={8}
        collisionPadding={12}
        className="w-56 rounded-md"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel className="truncate">
            {user.email}
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        {/* Sign out */}
        <DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <SignOutItem />
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AccountDropdown;
