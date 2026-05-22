"use client";

import { PasswordInput } from "@/components/password-input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { forgotPasswordPath, signUpPath, verifyEmailPath } from "@/path";
import { LucideLoaderCircle, LucideTicket } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import signInAction from "../actions/sign-in";
import SignInProviderForm from "./sign-in-provider-form";
import { useRouter } from "next/navigation";

const SignInForm = () => {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setIsPending(true);
    setError(null);
    const { error } = await signInAction(
      formData.get("email") as string,
      formData.get("password") as string,
    );
    setIsPending(false);
    if (error) {
      if (error.code === "EMAIL_NOT_VERIFIED") {
        router.push(verifyEmailPath(formData.get("email") as string));
        return;
      }
      setError(
        error.status === 429
          ? "Too many login attempts. Please try again later."
          : error.message || "Something went wrong.",
      );
    }
  };

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
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">
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
              <div className="grid gap-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href={forgotPasswordPath()}
                    className="text-xs text-muted-foreground hover:underline underline-offset-4"
                  >
                    Forgot password?
                  </Link>
                </div>
                <PasswordInput
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  required
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button
                type="submit"
                className="w-full mt-2"
                disabled={isPending}
              >
                {isPending && <LucideLoaderCircle className="animate-spin" />}
                Sign In
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
