import { convertToModelMessages, stepCountIs, streamText, UIMessage } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { redis } from "@/lib/redis";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { tool } from "ai";
import { z } from "zod";
import getAnalytics from "@/features/analytics/queries/get-analytics";

export const POST = async (request: Request) => {
  const { messages }: { messages: UIMessage[] } = await request.json();

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return new Response("Unauthorized", { status: 401 });

  // rate limiting
  const rateLimitKey = `chat-limit:${session.user.id}`;
  const requests = await redis.incr(rateLimitKey);
  if (requests === 1) await redis.expire(rateLimitKey, 60);
  if (requests > 10) return new Response("Too many requests", { status: 429 });

  // get active org from session
  const activeSession = await prisma.session.findFirst({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });
  const organizationId = activeSession?.activeOrganizationId;
  const [org, stripeCustomer, tickets, analytics] = await Promise.all([
    organizationId
      ? prisma.organization.findUnique({ where: { id: organizationId } })
      : null,
    organizationId
      ? prisma.stripeCustomer.findUnique({ where: { organizationId } })
      : null,
    organizationId
      ? prisma.ticket.findMany({
          where: { organizationId },
          take: 10,
          orderBy: { createdAt: "desc" },
        })
      : [],
    organizationId ? getAnalytics(organizationId) : null,
  ]);

  // get last message and create a cache key based on its text content
  const lastMessage = messages[messages.length - 1];
  const userText = lastMessage.parts.map((part: any) => part.text).join("");
  const cacheKey = `chat:${session.user.id}:${userText}`;

  const filteredMessages = messages.filter((message) =>
    message.parts.some(
      (part: any) => part.type === "text" && part.text.trim() !== "",
    ),
  );

  const result = streamText({
    model: anthropic("claude-haiku-4-5-20251001"),
    tools: {
      getOrgInfo: tool({
        description:
          "Get current organization details including members, roles, and plan. Use for any question about the org, team, billing, or permissions.",
        inputSchema: z.object({}),
        execute: async () => {
          const members = await prisma.member.findMany({
            where: { organizationId: organizationId ?? undefined },
            include: { user: { select: { name: true, email: true } } },
          });
          return {
            name: org?.name,
            plan:
              stripeCustomer?.subscriptionStatus === "active" ? "paid" : "free",
            members: members.map((m) => ({
              name: m.user.name,
              email: m.user.email,
              role: m.role,
            })),
          };
        },
      }),
      searchTickets: tool({
        description:
          "Fetch tickets from the user's organization. Optionally filter by keyword or status. Returns full details including title, status, deadline, bounty, and content. Call with no arguments to get all recent tickets.",
        inputSchema: z.object({
          query: z
            .string()
            .optional()
            .describe("keyword to search in title/content"),
          status: z.enum(["PENDING", "OPEN", "IN_PROGRESS", "DONE"]).optional(),
        }),
        execute: async ({
          query,
          status,
        }: {
          query?: string;
          status?: "PENDING" | "OPEN" | "IN_PROGRESS" | "DONE";
        }) => {
          const tickets = await prisma.ticket.findMany({
            where: {
              organizationId: organizationId ?? undefined,
              userId: session.user.id,
              ...(status && { status }),
              ...(query && {
                OR: [
                  { title: { contains: query, mode: "insensitive" } },
                  { content: { contains: query, mode: "insensitive" } },
                ],
              }),
            },
            take: 10,
            orderBy: { createdAt: "desc" },
          });

          if (!tickets.length)
            return "No tickets found. You can only access your own tickets.";
          return tickets.map((ticket) => ({
            id: ticket.id,
            title: ticket.title,
            status: ticket.status,
            bounty: ticket.bounty,
            deadline: ticket.deadline,
            content: ticket.content,
          }));
        },
      }),
    },
    stopWhen: stepCountIs(5),
    system: `You are the official AI assistant for TicketHub  — a team-based ticket and task management platform.

Your job is to help users navigate and use TicketHub v2 effectively.

TOOLS YOU CAN USE:
- searchTickets: use this for ANY question about ticket data — deadlines, status, content, lists, comparisons. Call with no arguments to retrieve all tickets.
- getOrgInfo: use this for ANY question about the organization, team members, roles, or billing plan.

- You can only access the current user's own tickets. If asked about someone else's tickets, say they are private and inaccessible.

TICKETS:
- Create tickets with a title, content, bounty reward ($), deadline, and status
- Ticket statuses: PENDING → OPEN → IN_PROGRESS → DONE
- Members submit tickets as PENDING — admins/owners approve or reject them
- Add comments and file attachments (images, PDFs) to tickets
- Mark tickets as private (paid plan only) — only visible to org members
- Bounty rewards are optional monetary incentives per ticket

ORGANIZATIONS:
- Create an organization and invite team members via email
- Roles: Owner, Admin, Member
  - Owner: full control, manages billing
  - Admin: can approve/reject tickets, manage members
  - Member: can create tickets and comments
- Switch between organizations from the sidebar

CURRENT USER CONTEXT:
- Organization: ${org?.name ?? "None"}
- Plan: ${stripeCustomer?.subscriptionStatus === "active" ? "paid" : "free"}
- Recent tickets: ${tickets.length ? tickets.map((t) => t.title).join(", ") : "None"}

ANALYTICS (organization stats):
- Total tickets: ${analytics?.totalTickets ?? 0}
- Completed tickets: ${analytics?.completedTickets ?? 0}
- Total bounty earned: $${analytics?.bountyEarned ?? 0}
- Tickets by status: ${analytics?.statusData.map((s) => `${s.status}: ${s.count}`).join(", ") ?? "None"}
- Found in the sidebar under Organization → Analytics
- Shows area chart (last 6 months) and bar chart by status
- Only accessible to owners and admins

ACCOUNT:
- Found in the sidebar under Account
- Update your profile name and avatar
- Change your password
- Manage your active sessions

FREE PLAN FEATURES:
- 1 member only (owner)
- Create and manage tickets
- Activity Log (all activity visible to owner)
- Basic organization management

PAID PLAN ONLY FEATURES (Start-Up or Business):
- Invite team members via email
- Member management (roles: Owner, Admin, Member)
- Private tickets (visible only to org members)
- Analytics dashboard (owners and admins only)
- Start-Up Plan: $19.99/mo or $199.99/yr — up to 3 members
- Business Plan: $39.99/mo or $399.99/yr — unlimited members
- Cancelling or downgrading automatically removes excess members

ACTIVITY LOG (available on ALL plans — free and paid):
- Found under Organization settings
- Owners and admins see all org activity
- Members only see their own activity
- Tracks: tickets, comments, attachments, invitations, subscription changes

If you cannot answer something, contact the developer:
- Developer: Johnsen Berdin
- Email: johnsenberdin2930@gmail.com
- GitHub: https://github.com/codeGoCodeNot
- Website: https://johnsenb.dev

Always be concise, friendly, and helpful. Only answer questions related to TicketHub.
`,

    messages: await convertToModelMessages(filteredMessages),

    onFinish: async ({ text }) => {
      const alreadySaved = await redis.get(cacheKey);

      if (!alreadySaved) {
        await redis.set(cacheKey, "1", { ex: 60 * 60 * 24 });
        await prisma.aiChat.createMany({
          data: [
            {
              role: "user",
              content: userText,
              userId: session.user.id,
            },
            {
              role: "assistant",
              content: text,
              userId: session.user.id,
            },
          ],
        });
      }
    },
  });

  return result.toUIMessageStreamResponse();
};
