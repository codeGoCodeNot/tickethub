import { avatarGradient } from "@/utils/avatar-fallback-style";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { cn } from "@/lib/utils";

type UserAvatarProps = {
  name?: string | null;
  image?: string | null;
  className?: string;
};

const UserAvatar = ({ name, image, className }: UserAvatarProps) => {
  return (
    <Avatar className={cn(className)}>
      <AvatarImage src={image ?? undefined} alt={name || "User Avatar"} />
      <AvatarFallback style={{ background: avatarGradient(name ?? "") }}>
        {name?.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
