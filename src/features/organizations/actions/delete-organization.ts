"use server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { organizationPath } from "@/path";

const deleteOrganization = async (id: string) => {
  await auth.api.deleteOrganization({
    headers: await headers(),
    body: { organizationId: id },
  });
  revalidatePath(organizationPath());
};

export default deleteOrganization;
