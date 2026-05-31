"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/password-input";
import PasswordStrengthMeter from "@/components/password-strength-meter";
import { LucideLoaderCircle } from "lucide-react";
import { EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state";
import updatePassword from "../actions/update-password";
import Form from "@/components/form/utils/form";

const PasswordForm = () => {
  const [newPassword, setNewPassword] = useState("");
  const [actionState, action, isPending] = useActionState(
    updatePassword,
    EMPTY_ACTION_STATE,
  );

  return (
    <Form action={action} actionState={actionState}>
      <div className="grid gap-1.5">
        <Label htmlFor="currentPassword">Current password</Label>
        <PasswordInput
          id="currentPassword"
          name="currentPassword"
          placeholder="••••••••"
          defaultValue={actionState.payload?.get("currentPassword") as string}
        />
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="newPassword">New password</Label>
        <PasswordInput
          id="newPassword"
          name="newPassword"
          placeholder="••••••••"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          defaultValue={actionState.payload?.get("newPassword") as string}
        />
        <PasswordStrengthMeter password={newPassword} />

        {actionState.fieldErrors?.newPassword?.[0] && (
          <p className="text-sm text-red-500">
            {actionState.fieldErrors.newPassword[0]}
          </p>
        )}
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="confirmPassword">Confirm new password</Label>
        <PasswordInput
          id="confirmPassword"
          name="confirmPassword"
          placeholder="••••••••"
          defaultValue={actionState.payload?.get("confirmPassword") as string}
        />
        {
          <p className="text-sm text-red-500">
            {actionState.fieldErrors?.["confirmPassword"]?.[0]}
          </p>
        }
      </div>

      <Button type="submit">
        {isPending && <LucideLoaderCircle className="animate-spin" />}
        Update password
      </Button>
    </Form>
  );
};

export default PasswordForm;
