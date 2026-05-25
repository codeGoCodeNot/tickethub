import InvitationEmail from "@/emails/invitation";
import sendEmail from "@/features/resend/send-email";
import { inngest } from "@/lib/inngest";
import { render } from "@react-email/components";

type eventOrgInvitation = {
  data: {
    email: string;
    invitedByUsername: string;
    teamName: string;
    invitationUrl: string;
  };
};

const eventOrgInvitation = inngest.createFunction(
  { id: "org-invitation-event", triggers: { event: "app/org-invitation" } },
  async ({ event }: { event: eventOrgInvitation }) => {
    await sendEmail({
      to: event.data.email,
      subject: `You're invited to join ${event.data.teamName} on Tickethub`,
      html: await render(
        InvitationEmail({
          invitedByUsername: event.data.invitedByUsername,
          teamName: event.data.teamName,
          invitationUrl: event.data.invitationUrl,
        }),
      ),
    });
  },
);

export default eventOrgInvitation;
