import prisma from "@/lib/prisma";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { inngest } from "./inngest";
import { hashPassword, verifyPassword } from "./password";
import { emailOTP, organization } from "better-auth/plugins";

export const auth = betterAuth({
  trustedOrigins: ["https://tickethub.johnsenb.dev"],
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await inngest.send({
        name: "app/reset-password",
        data: { email: user.email, url },
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
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        if (type === "email-verification") {
          await inngest.send({
            name: "app/verify-email",
            data: { email, otp },
          });
        }
      },
    }),
    organization({
      async sendInvitationEmail({ email, inviter, organization, id }) {
        const invitationUrl = `${process.env.BETTER_AUTH_URL}/organization/accept-invitation?id=${id}`;
        await inngest.send({
          name: "app/org-invitation",
          data: {
            email,
            invitedByUsername: inviter.user.name,
            teamName: organization.name,
            invitationUrl,
          },
        });
      },
    }),
  ],
});
