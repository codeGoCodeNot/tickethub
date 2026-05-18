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
