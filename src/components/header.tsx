"use client";

import { useSession } from "@/lib/auth-client";
import { homePath, signInPath, signUpPath, ticketsPath } from "@/path";
import { LucideKanban } from "lucide-react";
import Link from "next/link";
import AccountDropdown from "./account-dropdown";
import ThemeSwitcher from "./theme/theme-switcher";
import { Button } from "./ui/button";
import { SidebarTrigger } from "./ui/sidebar";

const Header = () => {
  const { data: session } = useSession();
  const user = session?.user;

  const navItems = user ? (
    <>
      <Button asChild variant="outline">
        <Link href={ticketsPath()} className="text-sm">
          <span>Tickets</span>
        </Link>
      </Button>

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
        <SidebarTrigger className="mr-2" />
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
