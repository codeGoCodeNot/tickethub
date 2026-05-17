"use client";

import { EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state";
import { PasswordInput } from "@/components/password-input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import signUp from "@/features/auth/actions/sign-up";
import SignInForm from "@/features/auth/components/sign-in-form";
import { signInPath } from "@/path";
import { LucideLoaderCircle, LucideTicket } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";

const SignUpForm = () => {
  const [actionState, action, isPending] = useActionState(
    signUp,
    EMPTY_ACTION_STATE,
  );

  return (
    <div className="flex flex-col flex-1 items-center justify-center px-4">
      <SignInForm />
    </div>
  );
};

export default SignUpForm;
