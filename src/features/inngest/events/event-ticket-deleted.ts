import TicketDeletedEmail from "@/emails/ticket-deleted";
import sendEmail from "@/features/resend/send-email";
import { inngest } from "@/lib/inngest";
import { render } from "@react-email/components";

type EventTicketDeleted = {
  data: {
    memberEmail: string;
    memberName: string;
    ticketTitle: string;
    organizationName: string;
    reason: string;
    adminName: string;
  };
};

const eventTicketDeleted = inngest.createFunction(
  { id: "ticket-deleted-event", triggers: { event: "app/ticket-deleted" } },
  async ({ event }: { event: EventTicketDeleted }) => {
    await sendEmail({
      to: event.data.memberEmail,
      subject: `Your ticket "${event.data.ticketTitle}" has been removed`,
      html: await render(
        TicketDeletedEmail({
          memberName: event.data.memberName,
          ticketTitle: event.data.ticketTitle,
          organizationName: event.data.organizationName,
          reason: event.data.reason,
          adminName: event.data.adminName,
        }),
      ),
    });
  },
);

export default eventTicketDeleted;
