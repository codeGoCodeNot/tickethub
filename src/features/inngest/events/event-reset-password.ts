import PasswordResetEmail from "@/emails/password-reset";
import sendEmail from "@/features/resend/send-email";
import { inngest } from "@/lib/inngest";
import { render } from "@react-email/components";

type eventResetPassword = {
  name: "app/reset-password";
  data: {
    email: string;
    url: string;
  };
};

const eventResetPassword = inngest.createFunction(
  {
    id: "reset-password-event",
    triggers: { event: "app/reset-password" },
  },
  async ({ event }: { event: eventResetPassword }) => {
    const { email, url } = event.data;
    await sendEmail({
      to: email,
      subject: "Reset your password",
      html: await render(PasswordResetEmail({ url })),
    });
  },
);

export default eventResetPassword;
