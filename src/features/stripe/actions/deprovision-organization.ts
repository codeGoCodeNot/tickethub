import createActivityLog from "@/features/activity-logs/actions/create-activity-log";
import { ActivityAction } from "@/generated/prisma/enums";
import { inngest } from "@/lib/inngest";
import prisma from "@/lib/prisma";
import { revalidateTag } from "next/cache";

const deprovisionOrganization = async (
  organizationId: string,
  allowedTeamMembers: number,
) => {
  const [members, invitations] = await Promise.all([
    prisma.member.findMany({
      where: { organizationId },
      orderBy: { createdAt: "desc" },
      include: { user: { select: { email: true, name: true } } },
    }),
    prisma.invitation.findMany({
      where: { organizationId, status: "pending" }, // cancel don't count towards team members
      orderBy: { createdAt: "asc" },
    }),
  ]);

  const totalTeamMembers = members.length + invitations.length;

  if (totalTeamMembers <= allowedTeamMembers) return;

  let excess = totalTeamMembers - allowedTeamMembers;

  const invitesDelete = invitations.slice(0, excess);

  excess -= invitesDelete.length;

  const membersToDelete = members.filter(
    (member) => member.role !== "owner" && member.role !== "admin",
  );

  const adminsToDelete = members.filter((member) => member.role === "admin");

  const membersDelete = [
    ...membersToDelete.slice(0, excess),
    ...adminsToDelete.slice(0, excess - membersToDelete.length),
  ];

  await prisma.$transaction([
    prisma.invitation.deleteMany({
      where: { id: { in: invitesDelete.map((invite) => invite.id) } },
    }),
    prisma.member.deleteMany({
      where: {
        id: { in: membersDelete.map((member) => member.id) },
      },
    }),
  ]);

  const removedCount = membersDelete.length + invitesDelete.length;

  if (removedCount > 0) {
    await createActivityLog({
      organizationId,
      action: ActivityAction.stripe_deprovision,
      metadata: {
        removedCount,
        allowedTeamMembers,
      },
    });

    revalidateTag(`activity-log-${organizationId}`, { expire: 0 });

    await inngest.send({
      name: "app/organization-deprovisioned",
      data: {
        organizationId,
        removedCount,
        removedMembers: membersDelete.map((member) => ({
          email: member.user.email,
          name: member.user.name,
        })),
      },
    });
  }
};

export default deprovisionOrganization;
