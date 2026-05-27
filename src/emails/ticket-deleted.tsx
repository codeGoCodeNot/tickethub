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

type TicketDeletedEmailProps = {
  memberName: string;
  ticketTitle: string;
  organizationName: string;
  reason: string;
  adminName: string;
  type: "removed" | "rejected";
};

const TicketDeletedEmail = ({
  memberName,
  ticketTitle,
  organizationName,
  reason,
  adminName,
  type,
}: TicketDeletedEmailProps) => (
  <Tailwind>
    <Html>
      <Head />
      <Preview>
        Your ticket "{ticketTitle}" has been{" "}
        {type === "removed" ? "removed" : "rejected"}
      </Preview>
      <Body className="bg-gray-100 m-0 p-0 font-sans">
        <Container className="bg-white mx-auto max-w-[560px] my-10 rounded-lg overflow-hidden">
          <Section className="bg-black px-8 py-6">
            <Text className="text-white text-xl font-bold m-0">TicketHub</Text>
          </Section>
          <Section className="px-8 py-10">
            <Text className="text-gray-900 text-2xl font-bold m-0 mb-4">
              Your ticket has been {type === "removed" ? "removed" : "rejected"}
            </Text>
            <Text className="text-gray-600 text-sm m-0 mb-2">
              Hi {memberName},
            </Text>
            <Text className="text-gray-600 text-sm m-0 mb-6">
              Your ticket{" "}
              <span style={{ fontWeight: 600, color: "#111" }}>
                "{ticketTitle}"
              </span>{" "}
              in{" "}
              <span style={{ fontWeight: 600, color: "#111" }}>
                {organizationName}
              </span>{" "}
              has been removed by {adminName}.
            </Text>
            <Section className="bg-gray-50 rounded-lg px-6 py-4 mb-6">
              <Text className="text-gray-500 text-xs font-semibold uppercase m-0 mb-1">
                Reason
              </Text>
              <Text className="text-gray-700 text-sm m-0">{reason}</Text>
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

export default TicketDeletedEmail;
