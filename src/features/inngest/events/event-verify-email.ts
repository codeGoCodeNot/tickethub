import VerifyEmail from "@/emails/verify-email";
import sendEmail from "@/features/resend/send-email";
import { inngest } from "@/lib/inngest";
import { render } from "@react-email/components";

const eventVerifyEmail = inngest.createFunction(
  { id: "verify-email-event", triggers: { event: "app/verify-email" } },
  async ({ event }: { event: { data: { email: string; otp: string } } }) => {
    await sendEmail({
      to: event.data.email,
      subject: "Your TicketHub verification code",
      html: await render(VerifyEmail({ otp: event.data.otp })),
    });
  },
);

export default eventVerifyEmail;
