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
import UserAvatar from "./user-avatar";
import Link from "next/link";
import { passwordPath, profilePath } from "@/path";
import { LucideLock, LucideUser } from "lucide-react";

type AccountDropdownProps = {
  user: User;
};

const AccountDropdown = ({ user }: AccountDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="cursor-pointer">
        <UserAvatar name={user.name} image={user.image} />
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

        {/* Profile */}
        <DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={profilePath()}>
              <LucideUser />
              <span className="text-xs text-muted-foreground">Profile</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        {/* Password */}
        <DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={passwordPath()}>
              <LucideLock />
              <span className="text-xs text-muted-foreground">Password</span>
            </Link>
          </DropdownMenuItem>
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
