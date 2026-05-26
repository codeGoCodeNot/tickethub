"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import UserAvatar from "@/components/user-avatar";
import OrganizationDialog from "@/features/organizations/components/organization-dialog";
import {
  organization,
  useActiveOrganization,
  useListOrganizations,
  useSession,
} from "@/lib/auth-client";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  LucideBuilding2,
  LucideChevronsUpDown,
  LucideClipboardCheck,
  LucideMail,
  LucidePlus,
  LucideUsers,
} from "lucide-react";
import { Route } from "next";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  accountNavItems,
  organizationNavItems,
  ticketNavItems,
} from "./constants";
import { invitationsPath, membershipsPath, ticketApprovePath } from "@/path";

const AppSidebar = () => {
  const { open, setOpen, isMobile } = useSidebar();
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;
  const { data: organizations } = useListOrganizations();
  const { data: activeOrganization } = useActiveOrganization();
  const [optimisticOrg, setOptimisticOrg] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const displayOrg = optimisticOrg ?? activeOrganization;
  const currentUserRole = activeOrganization?.members?.find(
    (member) => member.userId === user?.id,
  )?.role;
  const isOwnerOrAdmin = ["owner", "admin"].includes(currentUserRole ?? "");
  const router = useRouter();

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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton size="lg">
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                      <LucideBuilding2 className="size-4" />
                    </div>
                    <div className="flex flex-col gap-0.5 leading-none">
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={displayOrg?.id ?? "none"}
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 6 }}
                          transition={{ duration: 0.2 }}
                          className="font-semibold"
                        >
                          {displayOrg?.name ?? "No Organization"}
                        </motion.span>
                      </AnimatePresence>
                    </div>
                    <LucideChevronsUpDown className="ml-auto size-4 opacity-50" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  side={isMobile ? "bottom" : "right"}
                  className="w-56"
                >
                  <DropdownMenuLabel>Select Organization</DropdownMenuLabel>
                  {organizations?.map((org) => (
                    <DropdownMenuItem
                      key={org.id}
                      onSelect={async () => {
                        setOptimisticOrg({ id: org.id, name: org.name });
                        await organization.setActive({
                          organizationId: org.id,
                        });
                        router.refresh();
                      }}
                    >
                      {org.name}
                      {displayOrg?.id === org.id && (
                        <Check className="ml-auto size-4" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
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
                {displayOrg && isOwnerOrAdmin && (
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === ticketApprovePath()}
                    >
                      <Link href={ticketApprovePath() as Route}>
                        <LucideClipboardCheck />
                        <span>Approvals</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
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

        <SidebarGroup>
          <SidebarGroupLabel>Organization</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {organizationNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.href}>
                    <Link href={item.href as Route}>
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              {displayOrg && isOwnerOrAdmin && (
                <>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === membershipsPath(displayOrg.id)}
                    >
                      <Link href={membershipsPath(displayOrg.id)}>
                        <LucideUsers />
                        <span>Members</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === invitationsPath(displayOrg.id)}
                    >
                      <Link href={invitationsPath(displayOrg.id)}>
                        <LucideMail />
                        <span>Invitations</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </>
              )}
              <SidebarMenuItem>
                <OrganizationDialog
                  trigger={
                    <SidebarMenuButton>
                      <LucidePlus />
                      <span>Create</span>
                    </SidebarMenuButton>
                  }
                />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

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
                <LucideChevronsUpDown className="ml-auto size-4 opacity-50" />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </>
  );
};

export default AppSidebar;
