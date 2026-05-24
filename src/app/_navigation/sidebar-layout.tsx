import { SidebarProvider } from "@/components/ui/sidebar";
import { cookies } from "next/headers";
import Header from "./header";
import AppSidebar from "./sidebar/components/app-sidebar";

const SidebarLayout = async ({ children }: { children: React.ReactNode }) => {
  const cookieStore = await cookies();
  const sidebarOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <SidebarProvider defaultOpen={sidebarOpen}>
      <AppSidebar />
      <Header />
      <main className="min-h-screen flex-1 overflow-y-auto overflow-x-hidden py-24 px-8 bg-secondary/60 flex flex-col">
        {children}
      </main>
    </SidebarProvider>
  );
};

export default SidebarLayout;
