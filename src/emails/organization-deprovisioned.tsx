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

type OrganizationDeprovisionedEmailProps = {
  memberName: string;
  organizationName: string;
};

const OrganizationDeprovisionedEmail = ({
  memberName,
  organizationName,
}: OrganizationDeprovisionedEmailProps) => (
  <Tailwind>
    <Html>
      <Head />
      <Preview>
        You have been removed from {organizationName}
      </Preview>
      <Body className="bg-gray-100 m-0 p-0 font-sans">
        <Container className="bg-white mx-auto max-w-[560px] my-10 rounded-lg overflow-hidden">
          <Section className="bg-black px-8 py-6">
            <Text className="text-white text-xl font-bold m-0">TicketHub</Text>
          </Section>
          <Section className="px-8 py-10">
            <Text className="text-gray-900 text-2xl font-bold m-0 mb-4">
              You've been removed from your organization
            </Text>
            <Text className="text-gray-600 text-sm m-0 mb-2">
              Hi {memberName},
            </Text>
            <Text className="text-gray-600 text-sm m-0 mb-6">
              You have been removed from{" "}
              <span style={{ fontWeight: 600, color: "#111" }}>
                {organizationName}
              </span>{" "}
              due to a subscription plan downgrade. The organization has exceeded
              the member limit for their current plan.
            </Text>
            <Section className="bg-gray-50 rounded-lg px-6 py-4 mb-6">
              <Text className="text-gray-500 text-xs font-semibold uppercase m-0 mb-1">
                What happened?
              </Text>
              <Text className="text-gray-700 text-sm m-0">
                The organization's subscription was changed to a plan with a
                lower member limit. Members were automatically removed to comply
                with the new plan.
              </Text>
            </Section>
            <Text className="text-gray-400 text-xs m-0">
              If you believe this was a mistake, please contact your
              organization admin.
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

export default OrganizationDeprovisionedEmail;
