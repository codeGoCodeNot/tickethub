"use client";

import { setCookieByKey } from "@/actions/cookies";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { emailOtp } from "@/lib/auth-client";
import { ticketsPath } from "@/path";
import { LucideLoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import resendVerificationOtp from "../actions/resend-verification-otp";

type VerifyEmailFormProps = {
  email: string;
};

const VerifyEmailForm = ({ email }: VerifyEmailFormProps) => {
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const [resent, setResent] = useState(false);
  const router = useRouter();

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...digits];
    next[index] = value.slice(-1);
    setDigits(next);
    if (value && index < 5) refs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
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

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    const otp = digits.join("");
    if (otp.length < 6) return;
    setIsPending(true);
    const { error } = await emailOtp.verifyEmail({ email, otp });
    setIsPending(false);
    if (error) {
      setError(error.message ?? "Something went wrong.");
      return;
    }
    await setCookieByKey("toast", "Email verified successfully");
    router.push(ticketsPath());
  };

  const handleResend = async () => {
    const { error } = await resendVerificationOtp(email);
    if (error) {
      setError(error);
      return;
    }
    setResent(true);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex gap-2 justify-center my-4">
        {digits.map((digit, i) => (
          <Input
            key={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={handlePaste}
            maxLength={1}
            inputMode="numeric"
            className="w-10 h-12 text-center text-lg font-bold"
          />
        ))}
      </div>
      {error && <p className="text-sm text-red-500 text-center">{error}</p>}
      <div>
        <Button
          className="w-full mt-2"
          type="submit"
          disabled={isPending || digits.join("").length < 6}
        >
          {isPending && <LucideLoaderCircle className="animate-spin" />}
          Verify Email
        </Button>
        <Button
          variant="link"
          className="w-full mt-2"
          onClick={handleResend}
          disabled={resent}
        >
          {resent ? "OTP Sent" : "Resend OTP"}
        </Button>
      </div>
    </form>
  );
};

export default VerifyEmailForm;
