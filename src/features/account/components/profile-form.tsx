"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateUser } from "@/lib/auth-client";
import { LucideLoaderCircle } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

type ProfileFormProps = {
  name: string;
  image?: string;
  email: string;
};

const ProfileForm = ({ name, email }: ProfileFormProps) => {
  const [pendingName, setPendingName] = useState(name);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const toastId = toast.loading("Saving...");
      const { error } = await updateUser({ name: pendingName });
      if (error) {
        toast.error(error.message ?? "Failed to update profile.", {
          id: toastId,
        });
        return;
      }
      toast.success("Profile updated", { id: toastId });
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="border-0 shadow-md w-full max-w-[500px] mx-auto">
        <CardContent className="pt-6 flex flex-col gap-y-4">
          <div className="grid gap-1.5">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={pendingName}
              onChange={(e) => setPendingName(e.target.value)}
              placeholder="Your name"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} disabled />
            <p className="text-xs text-muted-foreground">
              Changing your email requires re-verification.
            </p>
          </div>
          <Button type="submit" disabled={isPending}>
            {isPending && <LucideLoaderCircle className="animate-spin" />}
            Save changes
          </Button>
        </CardContent>
      </Card>
    </form>
  );
};

export default ProfileForm;
