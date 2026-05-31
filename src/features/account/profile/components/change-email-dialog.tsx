"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { emailOtp, updateUser, useSession } from "@/lib/auth-client";
import { LucideLoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import requestEmailChange from "../actions/request-email-change";

const ChangeEmailDialog = () => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"email" | "otp">("email");
  const [newEmail, setNewEmail] = useState("");
  const [isPending, startTransition] = useTransition();
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const { data: session } = useSession();
  const router = useRouter();

  const reset = () => {
    setStep("email");
    setNewEmail("");
    setDigits(Array(6).fill(""));
  };

  const handleSendOtp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(async () => {
      const toastId = toast.loading("Sending verification code...");
      const result = await requestEmailChange(newEmail);
      if (result.status === "ERROR") {
        toast.error(result.message, { id: toastId });
        return;
      }
      toast.success(`Code sent to ${newEmail}`, { id: toastId });
      setStep("otp");
    });
  };

  const handleVerifyOtp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(async () => {
      const toastId = toast.loading("Updating email...");
      const otp = digits.join("");
      const { error } = await emailOtp.changeEmail({ newEmail, otp });
      if (error) {
        toast.error(error.message ?? "Invalid code.", { id: toastId });
        return;
      }
      if (session?.user?.name) {
        await updateUser({ name: session.user.name });
      }
      router.refresh();
      toast.success("Email updated", { id: toastId });
      setOpen(false);
      reset();
    });
  };

  const handleDigitChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...digits];
    next[index] = value.slice(-1);
    setDigits(next);
    if (value && index < 5) refs.current[index + 1]?.focus();
  };

  const handleDigitKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
  };

  const handleDigitPaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (!pasted) return;
    e.preventDefault();
    const next = Array(6).fill("");
    pasted.split("").forEach((char, i) => {
      next[i] = char;
    });
    setDigits(next);
    refs.current[Math.min(pasted.length, 5)]?.focus();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button variant="link" size="sm" className="h-auto p-0">
          Change email
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Email</DialogTitle>
          <DialogDescription>
            {step === "email"
              ? "We'll send a verification code to your new email address."
              : `Enter the 6-digit code we sent to ${newEmail}.`}
          </DialogDescription>
        </DialogHeader>

        {step === "email" ? (
          <form onSubmit={handleSendOtp} className="flex flex-col gap-y-3">
            <div className="grid gap-1.5">
              <Label htmlFor="new-email">New email</Label>
              <Input
                id="new-email"
                type="email"
                placeholder="new@example.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                required
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isPending || !newEmail}>
                {isPending && <LucideLoaderCircle className="animate-spin" />}
                Send code
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="flex flex-col gap-y-3">
            <div className="grid gap-1.5">
              <Label htmlFor="otp-0">Verification code</Label>
              <div className="flex gap-2 justify-center my-2">
                {digits.map((digit, i) => (
                  <Input
                    key={i}
                    id={i === 0 ? "otp-0" : undefined}
                    ref={(el) => {
                      refs.current[i] = el;
                    }}
                    value={digit}
                    onChange={(e) => handleDigitChange(i, e.target.value)}
                    onKeyDown={(e) => handleDigitKeyDown(i, e)}
                    onPaste={handleDigitPaste}
                    maxLength={1}
                    inputMode="numeric"
                    className="w-10 h-12 text-center text-lg font-bold"
                    disabled={isPending}
                  />
                ))}
              </div>
            </div>
            <DialogFooter className="flex gap-x-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setStep("email")}
                disabled={isPending}
              >
                Back
              </Button>
              <Button
                type="submit"
                disabled={isPending || digits.join("").length < 6}
              >
                {isPending && <LucideLoaderCircle className="animate-spin" />}
                Verify and update
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ChangeEmailDialog;
