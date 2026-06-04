# TicketHub

**Developer:** Johnsen Berdin
**Website:** [johnsenb.dev](https://johnsenb.dev)
**GitHub:** [github.com/codeGoCodeNot](https://github.com/codeGoCodeNot)
**Email:** johnsenberdin2930@gmail.com

---

A team-based ticket and task management platform with role-based access control, subscription plans, and an AI assistant.

## Tech Stack

| Tool | Purpose |
|------|---------|
| **Next.js 16** | Full-stack React framework (App Router) |
| **TypeScript** | Type safety |
| **Prisma** | ORM for PostgreSQL |
| **Supabase** | PostgreSQL database hosting |
| **Better Auth** | Authentication (email/password, Google OAuth, email OTP) |
| **Stripe** | Subscription billing and customer portal |
| **AWS S3** | File attachments and avatar image storage |
| **Inngest** | Background job processing (email sending, async tasks) |
| **Resend** | Transactional email delivery |
| **Upstash Redis** | Rate limiting and response caching |
| **Anthropic (Claude)** | AI chatbot assistant via Vercel AI SDK |
| **Zustand** | Client-side state management |
| **TanStack Query** | Server state and data fetching |
| **shadcn/ui + Radix UI** | UI component library |
| **Tailwind CSS v4** | Styling |
| **Recharts** | Analytics charts |
| **Framer Motion** | Animations |
| **Sentry** | Error monitoring |
| **Zod** | Schema validation |
| **nuqs** | Type-safe URL search params |

---

## Features

### Tickets
- Create tickets with a title, content, bounty reward ($), deadline, and status
- Ticket statuses: `PENDING → OPEN → IN_PROGRESS → DONE`
- Add comments and file attachments (images, PDFs) to tickets
- Mark tickets as **private** (paid plan only) — visible to org members only
- Bounty rewards are optional monetary incentives per ticket

### How to Use Tickets
1. Create a ticket from the **Tickets** section in the sidebar
2. Fill in title, content, deadline, and optional bounty
3. Ticket starts as `PENDING` — an Admin or Owner must approve it
4. Once approved it moves to `OPEN`, then `IN_PROGRESS`, then `DONE`
5. Add comments and attach files at any status
6. Private tickets are hidden from non-members (paid plan required)

### Organizations
- Create an organization and invite team members via email
- Switch between multiple organizations from the sidebar dropdown
- Activity log tracks all org events (tickets, comments, invitations, billing)

### Role-Based Access Control

| Role | Permissions |
|------|------------|
| **Owner** | Full control — manages billing, members, approvals, and all tickets |
| **Admin** | Approve/reject tickets, manage members, view all activity |
| **Member** | Create tickets and comments only, view own activity |

Ticket approval flow:
- Members submit tickets → status is `PENDING`
- Admins/Owners approve (moves to `OPEN`) or reject
- Only Owners and Admins see the **Approvals** page in the sidebar

### Subscription Plans

| Plan | Price | Members | Features |
|------|-------|---------|---------|
| **Free** | $0 | 1 (owner only) | Tickets, activity log |
| **Start-Up** | $19.99/mo or $199.99/yr | Up to 3 | + Invitations, members, private tickets, analytics |
| **Business** | $39.99/mo or $399.99/yr | Unlimited | Everything in Start-Up |

Paid-only features:
- Invite team members via email
- Member management
- Private tickets
- Analytics dashboard

### AI Chatbot Assistant
- Powered by **Claude Haiku** via Vercel AI SDK
- Has live access to org data via tools:
  - `searchTickets` — search tickets by keyword or status
  - `getOrgInfo` — fetch members, roles, and plan details
- Answers questions about tickets, org, billing, and platform features
- Rate limited to 10 requests per minute per user
- Chat history saved to database

### Analytics (paid plans only)
- Tickets created over the last 6 months — area chart
- Tickets by status breakdown — bar chart
- Stats: total tickets, completed count, total bounty earned
- Accessible to Owners and Admins only

### Account
- Update profile name and avatar (crop + upload to S3)
- Change password
- Change email (OTP verification required)
- Delete account

---

## Getting Started

### Prerequisites
- Node.js 20+
- pnpm
- PostgreSQL database (Supabase recommended)

### Environment Variables

```env
# Database
DATABASE_URL=

# Auth
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# AWS S3
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
AWS_BUCKET_NAME=

# Upstash Redis
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Resend
RESEND_API_KEY=

# Inngest
INNGEST_EVENT_KEY=
INNGEST_SIGNING_KEY=

# Anthropic
ANTHROPIC_API_KEY=
```

### Install and Run

```bash
pnpm install
pnpm prisma migrate dev
pnpm dev
```

---

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (authenticated)/    # Protected routes
│   └── _navigation/        # Sidebar and header
├── features/               # Feature modules
│   ├── analytics/          # Charts and stats
│   ├── auth/               # Auth helpers and guards
│   ├── ai/                 # AI chatbot component
│   ├── organizations/      # Org management
│   ├── stripe/             # Billing and subscriptions
│   ├── tickets/            # Ticket CRUD and approvals
│   ├── comment/            # Comments with Zustand edit state
│   └── account/            # Profile, avatar, password, sessions
├── components/             # Shared UI components
├── lib/                    # Third-party client setup (auth, prisma, stripe, s3, redis)
└── prisma/                 # Schema and migrations
```
