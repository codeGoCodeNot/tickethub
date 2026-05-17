import { EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state";
import { PasswordInput } from "@/components/password-input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { signUpPath } from "@/path";
import { LucideLoaderCircle, LucideTicket } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";
import signUp from "../actions/sign-up";
import SignInProviderForm from "./sign-in-provider-form";

const SignInForm = () => {
  const [actionState, action, isPending] = useActionState(
    signUp,
    EMPTY_ACTION_STATE,
  );

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="flex flex-col items-center gap-y-2 text-center">
        <div className="flex items-center justify-center size-10 rounded-xl bg-primary text-primary-foreground">
          <LucideTicket className="size-5" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">
          Sign in to your account
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your details below to get started
        </p>
      </div>

      <Card className="border-0 shadow-md">
        <CardContent className="pt-6">
          <form action={action}>
            <div className="flex flex-col gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  defaultValue={actionState.payload?.get("email") as string}
                  required
                />
                <p className="text-sm text-red-500">
                  {actionState.fieldErrors?.["email"]?.[0]}
                </p>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="password">Password</Label>
                <PasswordInput
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  defaultValue={actionState.payload?.get("password") as string}
                  required
                />
                <p className="text-sm text-red-500">
                  {actionState.fieldErrors?.["password"]?.[0]}
                </p>
              </div>

              <Button
                type="submit"
                className="w-full mt-2"
                disabled={isPending}
              >
                {isPending && <LucideLoaderCircle className="animate-spin" />}
                Create account
              </Button>
            </div>
          </form>

          <div className="relative my-4">
            <Separator />
            <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
              or
            </span>
          </div>

          <SignInProviderForm />
        </CardContent>
      </Card>

      <p className="text-center text-sm text-muted-foreground">
        Don't have an account?
        <Link
          href={signUpPath()}
          className="font-medium text-foreground hover:underline underline-offset-4 ml-2"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default SignInForm;
