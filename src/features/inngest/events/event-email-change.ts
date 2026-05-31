import VerifyEmail from "@/emails/verify-email";
import sendEmail from "@/features/resend/send-email";
import { inngest } from "@/lib/inngest";
import { render } from "@react-email/components";

type EmailChangeArgs = {
  data: {
    email: string;
    otp: string;
  };
};

export const eventEmailChange = inngest.createFunction(
  { id: "email-change", triggers: { event: "app/change-email" } },
  async ({ event }: { event: EmailChangeArgs }) => {
    await sendEmail({
      to: event.data.email,
      subject: "Your TicketHub email change verification code",
      html: await render(VerifyEmail({ otp: event.data.otp })),
    });
  },
);

export default eventEmailChange;
