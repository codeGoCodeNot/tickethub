import PasswordResetEmail from "@/emails/password-reset";
import sendEmail from "@/features/resend/send-email";
import prisma from "@/lib/prisma";
import { render } from "@react-email/components";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { hashPassword, verifyPassword } from "./password";

export const auth = betterAuth({
  trustedOrigins: ["https://tickethub.johnsenb.dev"],
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      void sendEmail({
        to: user.email,
        subject: "Reset your password",
        html: await render(PasswordResetEmail({ url })),
      });
    },
    password: {
      hash: hashPassword,
      verify: verifyPassword,
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
});
