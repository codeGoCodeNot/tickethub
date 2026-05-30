import { eventAttachmentDeleted } from "@/features/inngest/events/event-attachment-deleted";
import eventOrgInvitation from "@/features/inngest/events/event-org-invitation";
import { eventOrganizationDeleted } from "@/features/inngest/events/event-organization-deleted";
import eventResetPassword from "@/features/inngest/events/event-reset-password";
import eventTicketDeleted from "@/features/inngest/events/event-ticket-deleted";
import eventVerifyEmail from "@/features/inngest/events/event-verify-email";
import eventWelcome from "@/features/inngest/events/event-welcome";
import { inngest } from "@/lib/inngest";
import { serve } from "inngest/next";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    eventResetPassword,
    eventWelcome,
    eventVerifyEmail,
    eventOrgInvitation,
    eventTicketDeleted,
    eventAttachmentDeleted,
    eventOrganizationDeleted,
  ],
});
