import OrganizationDeprovisionedEmail from "@/emails/organization-deprovisioned";
import sendEmail from "@/features/resend/send-email";
import { inngest } from "@/lib/inngest";
import prisma from "@/lib/prisma";
import { render } from "@react-email/components";

type EventOrganizationDeprovisionedArgs = {
  event: {
    data: {
      organizationId: string;
      removedCount: number;
      removedMembers: { email: string; name: string }[];
    };
  };
};

const eventDeprovisionedOrganization = inngest.createFunction(
  {
    id: "organization-deprovisioned",
    triggers: { event: "app/organization-deprovisioned" },
  },
  async ({ event }: EventOrganizationDeprovisionedArgs) => {
    const { organizationId, removedMembers } = event.data;

    const organization = await prisma.organization.findUniqueOrThrow({
      where: { id: organizationId },
    });

    for (const member of removedMembers) {
      // Send deprovisioned email to each removed member
      await sendEmail({
        to: member.email,
        subject: `You've been removed from ${organization.name}`,
        html: await render(
          OrganizationDeprovisionedEmail({
            memberName: member.name,
            organizationName: organization.name,
          }),
        ),
      });
    }
  },
);

export default eventDeprovisionedOrganization;
