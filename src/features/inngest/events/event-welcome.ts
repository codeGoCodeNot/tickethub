import WelcomeEmail from "@/emails/welcome";
import sendEmail from "@/features/resend/send-email";
import { inngest } from "@/lib/inngest";
import { render } from "@react-email/components";

type eventWelcomeProps = {
  data: {
    email: string;
    name: string;
  };
};

const eventWelcome = inngest.createFunction(
  {
    id: "welcome-event",
    triggers: { event: "app/welcome" },
  },
  async ({ event }: { event: eventWelcomeProps }) => {
    const { email, name } = event.data;

    await sendEmail({
      to: email,
      subject: "Welcome to TicketHub!",
      html: await render(
        WelcomeEmail({
          toName: name,
          loginUrl: "https://tickethub.johnsenb.dev/sign-in",
        }),
      ),
    });
  },
);

export default eventWelcome;
