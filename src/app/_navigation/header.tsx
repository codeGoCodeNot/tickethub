"use client";

import AccountDropdown from "@/app/_navigation/account-dropdown";
import ThemeSwitcher from "@/components/theme/theme-switcher";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useActiveOrganization, useSession } from "@/lib/auth-client";
import { homePath, signInPath, signUpPath, ticketsPath } from "@/path";
import { LucideKanban } from "lucide-react";
import Link from "next/link";

const Header = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const { data: activeOrg } = useActiveOrganization();

  const navItems = user ? (
    <>
      {activeOrg && (
        <Button asChild variant="outline" size="sm">
          <Link href="/tickets">Tickets</Link>
        </Button>
      )}

      <AccountDropdown user={user} />
    </>
  ) : (
    <>
      <Button asChild variant="outline">
        <Link href={signUpPath()} className="text-sm">
          <span>Sign Up</span>
        </Link>
      </Button>
      <Button asChild>
        <Link href={signInPath()} className="text-sm">
          <span>Sign In</span>
        </Link>
      </Button>
    </>
  );

  return (
    <nav className="supports-backdrop-blur:bg-background/60 fixed left-0 right-0 top-0 z-20 border-b bg-secondary/40 backdrop-blur w-full flex py-2.5 px-5 justify-between items-center animate-fade-from-top">
      <div>
        {user && <SidebarTrigger className="mr-2" />}
        <Button asChild variant="ghost">
          <Link href={homePath()} className="text-lg font-bold">
            <LucideKanban />
            <span className="text-lg font-semibold">TicketHub</span>
          </Link>
        </Button>
      </div>
      <div className="flex items-center gap-x-2">
        <ThemeSwitcher />
        {navItems}
      </div>
    </nav>
  );
};

export default Header;
