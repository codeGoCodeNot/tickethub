"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useSession } from "@/lib/auth-client";
import { LucideBuilding2, LucideChevronUp } from "lucide-react";
import { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { accountNavItems, ticketNavItems } from "./constants";
import UserAvatar from "@/components/user-avatar";

const AppSidebar = () => {
  const { open, setOpen, isMobile } = useSidebar();
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <>
      {open && !isMobile && (
        <div
          className="fixed inset-0 z-[9] bg-transparent"
          onClick={() => setOpen(false)}
        />
      )}
      <Sidebar>
        <SidebarHeader className="border-b mt-20">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" className="cursor-default">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <LucideBuilding2 className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">My Organization</span>
                  <span className="text-xs text-muted-foreground">
                    Personal
                  </span>
                </div>
                <LucideChevronUp className="ml-auto size-4 opacity-50" />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent className="px-2 mt-2">
          <SidebarGroup>
            <SidebarGroupLabel>Tickets</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {ticketNavItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.href}
                    >
                      <Link href={item.href as Route}>
                        {item.icon}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Account</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {accountNavItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.href}
                    >
                      <Link href={item.href as Route}>
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

        <SidebarFooter className="border-t">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg">
                <UserAvatar name={user?.name} image={user?.image} />
                <div className="flex flex-col gap-0.5 leading-none overflow-hidden">
                  <span className="font-semibold truncate">{user?.name}</span>
                  <span className="text-xs text-muted-foreground truncate">
                    {user?.email}
                  </span>
                </div>
                <LucideChevronUp className="ml-auto size-4 opacity-50" />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </>
  );
};

export default AppSidebar;
