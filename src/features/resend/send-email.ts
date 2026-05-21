import { resend } from "@/lib/resend";

type SendEmailParams = {
  to: string;
  subject: string;
  text: string;
};

const sendEmail = async ({ to, subject, text }: SendEmailParams) => {
  await resend.emails.send({
    from: "noreply@tickethub.johnsenb.dev",
    to,
    subject,
    text,
  });
};

export default sendEmail;
