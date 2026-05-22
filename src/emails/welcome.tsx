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

interface WelcomeEmailProps {
  toName: string;
  loginUrl: string;
}

const WelcomeEmail = ({ toName, loginUrl }: WelcomeEmailProps) => (
  <Tailwind>
    <Html>
      <Head />
      <Preview>Welcome to TicketHub, {toName}!</Preview>
      <Body className="bg-gray-100 m-0 p-0 font-sans">
        <Container className="bg-white mx-auto max-w-[560px] my-10 rounded-lg overflow-hidden">
          <Section className="bg-black px-8 py-6">
            <Text className="text-white text-xl font-bold m-0">TicketHub</Text>
          </Section>

          <Section className="px-8 py-10">
            <Text className="text-gray-900 text-2xl font-bold m-0 mb-4">
              Welcome, {toName}!
            </Text>
            <Text className="text-gray-600 text-sm m-0 mb-2">
              Hi {toName}, welcome to TicketHub!
            </Text>
            <Text className="text-gray-600 text-sm m-0 mb-6">
              We're excited to have you on board. Let us know if you ever have
              questions!
            </Text>

            <Button
              href={loginUrl}
              className="bg-black text-white text-sm font-medium px-6 py-3 rounded-md inline-block"
            >
              Get Started
            </Button>
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

WelcomeEmail.PreviewProps = {
  toName: "Johnsen",
  loginUrl: "https://tickethub.johnsenb.dev/sign-in",
} satisfies WelcomeEmailProps;

export default WelcomeEmail;
