import { SidebarProvider } from "@/components/ui/sidebar";
import { cookies } from "next/headers";
import Header from "./header";
import AppSidebar from "./sidebar/components/app-sidebar";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

const SidebarLayout = async ({ children }: { children: React.ReactNode }) => {
  const cookieStore = await cookies();
  const sidebarOpen = cookieStore.get("sidebar_state")?.value === "true";
  const session = await auth.api.getSession({ headers: await headers() });
  let isPaidPlan = false;
  const allSessions = await prisma.session.findFirst({
    where: { userId: session?.user.id },
    orderBy: { createdAt: "desc" },
  });
  const memberships = await prisma.member.findMany({
    where: { userId: session?.user.id },
    select: { organizationId: true },
  });
  const stripeCustomers = await prisma.stripeCustomer.findMany({
    where: { organizationId: { in: memberships.map((m) => m.organizationId) } },
    select: { organizationId: true, subscriptionStatus: true },
  });
  const paidOrgIds = new Set(
    stripeCustomers
      .filter((s) => s.subscriptionStatus === "active")
      .map((s) => s.organizationId),
  );

  return (
    <SidebarProvider defaultOpen={sidebarOpen}>
      <AppSidebar paidOrgIds={[...paidOrgIds]} />
      <Header />
      <main className="min-h-screen flex-1 overflow-y-auto overflow-x-hidden py-24 px-8 bg-secondary/60 flex flex-col">
        {children}
      </main>
    </SidebarProvider>
  );
};

export default SidebarLayout;
