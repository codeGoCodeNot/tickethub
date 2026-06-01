"use client";

import { Label } from "@/components/ui/label";
import ChangeEmailDialog from "./change-email-dialog";
import ChangeNameDialog from "./change-name-dialog";

type ProfileFormProps = {
  name: string;
  image?: string;
  email: string;
};

const ProfileForm = ({ name, email }: ProfileFormProps) => {
  return (
    <div className="flex flex-col gap-y-5">
      <div className="grid gap-1.5">
        <Label>Name</Label>
        <div className="flex items-center justify-between gap-x-2 rounded-md border bg-muted/30 px-3 py-2">
          <span className="text-sm truncate">{name}</span>
          <ChangeNameDialog currentName={name} />
        </div>
      </div>
      <div className="grid gap-1.5">
        <Label>Email</Label>
        <div className="flex items-center justify-between gap-x-2 rounded-md border bg-muted/30 px-3 py-2">
          <span className="text-sm truncate">{email}</span>
          <ChangeEmailDialog />
        </div>
        <p className="text-xs text-muted-foreground">
          Changing your email requires verification.
        </p>
      </div>
    </div>
  );
};

export default ProfileForm;
