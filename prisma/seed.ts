import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

const tickets = [
  {
    id: "1",
    title: "Sample Ticket 1",
    content: "This is a first sample ticket.",
    status: "OPEN" as const,
  },
  {
    id: "2",
    title: "Sample Ticket 2",
    content: "This is a second sample ticket.",
    status: "DONE" as const,
  },
  {
    id: "3",
    title: "Sample Ticket 3",
    content: "This is a third sample ticket.",
    status: "IN_PROGRESS" as const,
  },
];

const seed = async () => {
  const t0 = performance.now();
  console.log("Db seeding started...");
  await prisma.ticket.deleteMany();

  await prisma.ticket.createMany({
    data: tickets,
  });
  const t1 = performance.now();
  console.log(`Db seeding finished in ${(t1 - t0).toFixed(2)} ms.`);

  await prisma.$disconnect();
};

seed();
