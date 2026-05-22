import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface PasswordResetEmailProps {
  url: string;
}

const PasswordResetEmail = ({ url }: PasswordResetEmailProps) => (
  <Tailwind>
    <Html>
      <Head />
      <Preview>Reset your TicketHub password</Preview>
      <Body className="bg-gray-100 m-0 p-0 font-sans">
        <Container className="bg-white mx-auto max-w-[560px] my-10 rounded-lg overflow-hidden">
          <Section className="bg-black px-8 py-6">
            <Text className="text-white text-xl font-bold m-0">TicketHub</Text>
          </Section>

          <Section className="px-8 py-10">
            <Text className="text-gray-900 text-2xl font-bold m-0 mb-4">
              Reset your password
            </Text>
            <Text className="text-gray-600 text-sm m-0 mb-6">
              We received a request to reset your password. Click the button
              below to create a new one. This link expires in 1 hour.
            </Text>

            <Button
              href={url}
              className="bg-black text-white text-sm font-medium px-6 py-3 rounded-md inline-block"
            >
              Reset Password
            </Button>

            <Text className="text-gray-500 text-xs m-0 mt-6">
              If you didn't request a password reset, you can safely ignore this
              email.
            </Text>
          </Section>

          <Section className="border-t border-gray-200 px-8 py-6">
            <Text className="text-gray-400 text-xs m-0">
              Johnsen Berdin
              <br />
              Pilipog Cordova Cebu Philippines
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  </Tailwind>
);

PasswordResetEmail.PreviewProps = {
  url: "https://tickethub.johnsenb.dev/reset-password?token=preview",
} satisfies PasswordResetEmailProps;

export default PasswordResetEmail;
