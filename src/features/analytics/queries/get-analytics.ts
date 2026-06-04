import prisma from "@/lib/prisma";

const getAnalytics = async (organizationId: string) => {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const [statusCounts, bountyResult, recentTickets] = await Promise.all([
    prisma.ticket.groupBy({
      by: ["status"],
      where: { organizationId },
      _count: { _all: true },
    }),
    prisma.ticket.aggregate({
      where: { organizationId, status: "DONE" },
      _sum: { bounty: true },
      _count: { _all: true },
    }),
    prisma.ticket.findMany({
      where: { organizationId, createdAt: { gte: sixMonthsAgo } },
      select: { createdAt: true },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  const monthlyMap: Record<string, number> = {};
  for (const ticket of recentTickets) {
    const label = ticket.createdAt.toLocaleString("en", { month: "short" });
    monthlyMap[label] = (monthlyMap[label] ?? 0) + 1;
  }
  const monthlyData = Object.entries(monthlyMap).map(([month, tickets]) => ({
    month,
    tickets,
  }));

  return {
    totalTickets: recentTickets.length,
    completedTickets: bountyResult._count._all,
    bountyEarned: bountyResult._sum.bounty ?? 0,
    statusData: statusCounts.map((item) => ({
      status: item.status,
      count: item._count._all,
    })),
    monthlyData,
  };
};

export default getAnalytics;
