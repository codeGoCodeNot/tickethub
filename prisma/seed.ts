import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hashPassword } from "@/lib/password";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

const users = [
  {
    id: "1",
    name: "Johnsen",
    email: "johnsenberdin07@gmail.com",
    image: "/keanu.avif",
  },
  { id: "2", name: "user", email: "user@example.com" },
];

const tickets = [
  {
    title: "Sample Ticket 1",
    content: "This is a first sample ticket.",
    status: "OPEN" as const,
    deadline: new Date().toISOString().split("T")[0],
    bounty: 199,
  },
  {
    title: "Sample Ticket 2",
    content: "This is a second sample ticket.",
    status: "DONE" as const,
    deadline: new Date().toISOString().split("T")[0],
    bounty: 299,
  },
  {
    title: "Sample Ticket 3",
    content: "This is a third sample ticket.",
    status: "IN_PROGRESS" as const,
    deadline: new Date().toISOString().split("T")[0],
    bounty: 399,
  },
];

const comments = [
  { content: "First comment from DB" },
  { content: "Second comment from DB" },
  { content: "Third comment from DB" },
];

const seed = async () => {
  const t0 = performance.now();
  console.log("Db seeding started...");
  await prisma.organization.deleteMany();
  await prisma.user.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.comment.deleteMany();

  await prisma.user.createMany({ data: users });

  const hashedPassword = await hashPassword("password123");

  await prisma.account.create({
    data: {
      id: "acc-1",
      accountId: users[0].id,
      providerId: "credential",
      userId: users[0].id,
      password: hashedPassword,
    },
  });

  const org = await prisma.organization.create({
    data: {
      id: "org-1",
      name: "Tickethub",
      slug: "tickethub",
      createdAt: new Date(),
    },
  });

  await prisma.member.createMany({
    data: [
      {
        id: "member-1",
        organizationId: org.id,
        userId: users[0].id, // Johnsen - owner
        role: "owner",
        createdAt: new Date(),
      },
      {
        id: "member-2",
        organizationId: org.id,
        userId: users[1].id, // user@example.com - member
        role: "member",
        createdAt: new Date(),
      },
    ],
  });

  const dbTickets = await prisma.ticket.createManyAndReturn({
    data: tickets.map((ticket) => ({
      ...ticket,
      userId: users[0].id,
    })),
  });

  await prisma.comment.createMany({
    data: comments.map((comment) => ({
      ...comment,
      userId: users[0].id,
      ticketId: dbTickets[0].id,
    })),
  });

  const t1 = performance.now();
  console.log(`Db seeding finished in ${(t1 - t0).toFixed(2)} ms.`);

  await prisma.$disconnect();
};

seed();
