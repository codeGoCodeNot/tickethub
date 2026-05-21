"use client";

import { PasswordInput } from "@/components/password-input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { LucideLoaderCircle } from "lucide-react";
import { useState } from "react";

const PasswordResetForm = ({ token }: { token: string }) => {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: wire up reset password action
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-4">
        <div className="grid gap-1.5">
          <Label htmlFor="password">New Password</Label>
          <PasswordInput
            id="password"
            name="password"
            placeholder="••••••••"
            required
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <PasswordInput
            id="confirmPassword"
            name="confirmPassword"
            placeholder="••••••••"
            required
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button type="submit" className="w-full mt-2" disabled={isPending}>
          {isPending && <LucideLoaderCircle className="animate-spin" />}
          Reset Password
        </Button>
      </div>
    </form>
  );
};

export default PasswordResetForm;
