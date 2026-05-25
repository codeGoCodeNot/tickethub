import {
  Body,
  Container,
  Head,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

type InvitationEmailProps = {
  invitedByUsername: string;
  teamName: string;
  invitationUrl: string;
};

const InvitationEmail = ({
  invitedByUsername,
  teamName,
  invitationUrl,
}: InvitationEmailProps) => (
  <Tailwind>
    <Html>
      <Head />
      <Preview>You've been invited to join {teamName} on TicketHub</Preview>
      <Body className="bg-gray-100 m-0 p-0 font-sans">
        <Container className="bg-white mx-auto max-w-[560px] my-10 rounded-lg overflow-hidden">
          <Section className="bg-black px-8 py-6">
            <Text className="text-white text-xl font-bold m-0">TicketHub</Text>
          </Section>
          <Section className="px-8 py-10">
            <Text className="text-gray-900 text-2xl font-bold m-0 mb-4">
              You're invited to join {teamName}
            </Text>
            <Text className="text-gray-600 text-sm m-0 mb-6">
              {invitedByUsername} has invited you to join their organization on
              TicketHub.
            </Text>
            <Link
              href={invitationUrl}
              className="bg-black text-white px-6 py-3 rounded-lg text-sm font-medium no-underline"
            >
              Accept Invitation
            </Link>
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

export default InvitationEmail;
