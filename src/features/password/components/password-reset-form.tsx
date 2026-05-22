"use client";

import Form from "@/components/form/utils/form";
import { PasswordInput } from "@/components/password-input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { LucideLoaderCircle } from "lucide-react";
import { useActionState, useState } from "react";
import passwordReset from "../actions/reset-password";
import { EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state";
import PasswordStrengthMeter from "@/components/password-strength-meter";

type PasswordResetFormProps = {
  token: string;
};

const PasswordResetForm = ({ token }: PasswordResetFormProps) => {
  const [actionState, action, isPending] = useActionState(
    passwordReset,
    EMPTY_ACTION_STATE,
  );
  const [password, setPassword] = useState("");

  return (
    <Form action={action} actionState={actionState}>
      <input type="hidden" name="token" value={token} />
      <div className="grid gap-1.5">
        <Label htmlFor="password">New Password</Label>
        <PasswordInput
          id="password"
          name="newPassword"
          placeholder="••••••••"
          onChange={(e) => setPassword(e.target.value)}
          defaultValue={actionState.payload?.get("newPassword") as string}
          required
        />
        <PasswordStrengthMeter password={password} />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <PasswordInput
          id="confirmPassword"
          name="confirmPassword"
          placeholder="••••••••"
          defaultValue={actionState.payload?.get("confirmPassword") as string}
          required
        />
      </div>
      <Button type="submit" className="w-full mt-2" disabled={isPending}>
        {isPending && <LucideLoaderCircle className="animate-spin" />}
        Reset Password
      </Button>
    </Form>
  );
};

export default PasswordResetForm;
