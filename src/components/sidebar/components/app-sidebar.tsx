"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import navItems from "./constants";

const AppSidebar = () => {
  const { open, setOpen, isMobile } = useSidebar();
  const pathname = usePathname();

  return (
    <>
      {open && !isMobile && (
        <div
          className="fixed inset-0 z-[9] bg-transparent"
          onClick={() => setOpen(false)}
        />
      )}
      <Sidebar>
        <SidebarContent className="px-2 mt-20">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.href}
                    >
                      <Link
                        href={item.href as Route}
                        className="flex items-center gap-x-2"
                      >
                        {item.icon}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t p-4">
          <p className="text-xs text-muted-foreground">TicketHub v3.0</p>
        </SidebarFooter>
      </Sidebar>
    </>
  );
};

export default AppSidebar;
