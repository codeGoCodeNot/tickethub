import { deleteObjectByPrefix } from "@/lib/aws";
import { inngest } from "@/lib/inngest";
import prisma from "@/lib/prisma";

export type EventOrganizationDeletedArgs = {
  data: {
    organizationId: string;
  };
};

export const eventOrganizationDeleted = inngest.createFunction(
  {
    id: "organization-deleted",
    triggers: { event: "app/organization.deleted" },
  },
  async ({ event, step }) => {
    const { organizationId } = event.data;

    const stillExists = await step.run("check-org-exists", () =>
      prisma.organization.findUnique({
        where: { id: organizationId },
      }),
    );

    if (stillExists) return;

    await step.run("delete-s3-prefix", () =>
      deleteObjectByPrefix(`${organizationId}/`),
    );
  },
);
