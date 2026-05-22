import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

const VerifyEmail = ({ otp }: { otp: string }) => (
  <Tailwind>
    <Html>
      <Head />
      <Preview>Your TicketHub verification code: {otp}</Preview>
      <Body className="bg-gray-100 m-0 p-0 font-sans">
        <Container className="bg-white mx-auto max-w-[560px] my-10 rounded-lg overflow-hidden">
          <Section className="bg-black px-8 py-6">
            <Text className="text-white text-xl font-bold m-0">TicketHub</Text>
          </Section>
          <Section className="px-8 py-10">
            <Text className="text-gray-900 text-2xl font-bold m-0 mb-4">
              Verify your email
            </Text>
            <Text className="text-gray-600 text-sm m-0 mb-6">
              Enter this code to verify your email. Expires in 10 minutes.
            </Text>
            <div className="bg-gray-100 rounded-lg px-8 py-6 text-center">
              <Text className="text-4xl font-bold tracking-widest text-gray-900 m-0">
                {otp}
              </Text>
            </div>
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

export default VerifyEmail;
