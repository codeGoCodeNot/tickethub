import { resend } from "@/lib/resend";

type SendEmailParams = {
  to: string;
  subject: string;
  html: string;
};

const sendEmail = async ({ to, subject, html }: SendEmailParams) => {
  await resend.emails.send({
    from: "noreply@tickethub.johnsenb.dev",
    to,
    subject,
    html,
  });
};

export default sendEmail;
