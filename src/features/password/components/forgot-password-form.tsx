"use client";

import { EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInPath } from "@/path";
import {
  LucideArrowLeft,
  LucideKeyRound,
  LucideLoaderCircle,
} from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";
import forgotPassword from "../actions/forgot-password";
import Form from "@/components/form/utils/form";

const ForgotPasswordForm = () => {
  const [actionState, action, isPending] = useActionState(
    forgotPassword,
    EMPTY_ACTION_STATE,
  );

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="flex flex-col items-center gap-y-2 text-center">
        <div className="flex items-center justify-center size-10 rounded-xl bg-primary text-primary-foreground">
          <LucideKeyRound className="size-5" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Forgot password?</h1>
        <p className="text-sm text-muted-foreground">
          Enter your email and we'll send you a reset link
        </p>
      </div>

      <Card className="border-0 shadow-md">
        <CardContent className="pt-6">
          <Form action={action} actionState={actionState}>
            <div className="grid gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
              />
            </div>
            <p className="text-sm text-red-500">
              {actionState.fieldErrors?.["email"]?.[0]}
            </p>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending && <LucideLoaderCircle className="animate-spin" />}
              Send reset link
            </Button>
          </Form>
        </CardContent>
      </Card>

      <p className="text-center text-sm text-muted-foreground">
        <Link
          href={signInPath()}
          className="flex items-center justify-center gap-x-1 hover:underline underline-offset-4"
        >
          <LucideArrowLeft className="size-3" />
          Back to sign in
        </Link>
      </p>
    </div>
  );
};

export default ForgotPasswordForm;
