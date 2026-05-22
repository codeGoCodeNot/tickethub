"use server";

import { auth } from "@/lib/auth";
import { emailOtpRateLimit } from "@/lib/rate-limit";

const resendVerificationOtp = async (email: string) => {
  const { success, reset } = await emailOtpRateLimit.limit(email);
  if (!success) {
    const resetIn = Math.ceil((reset - Date.now()) / 1000 / 60);
    return {
      error: `Too many attempts. Please try again in ${resetIn} minutes.`,
    };
  }

  await auth.api.sendVerificationOTP({
    body: { email, type: "email-verification" },
  });

  return { error: null };
};

export default resendVerificationOtp;
