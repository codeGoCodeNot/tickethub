"use server";

import { inngest } from "@/lib/inngest";

const triggerOrgCreated = async (organizationId: string, byEmail: string) => {
  await inngest.send({
    name: "app/organization-created",
    data: { organizationId, byEmail },
  });
};

export default triggerOrgCreated;
