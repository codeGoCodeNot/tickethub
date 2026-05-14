import { homePath, ticketsPath } from "@/path";
import { LucideKanban } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

const Header = () => {
  return (
    <nav className="supports-backdrop-blur:bg-background/60 fixed left-0 right-0 top-0 z-20 border-b bg-background/95 backdrop-blur w-full flex py-2.5 px-5 justify-between items-center">
      <Button asChild variant="ghost">
        <Link href={homePath()} className="text-lg font-bold">
          <LucideKanban />
          <h1 className="text-lg font-semibold">TicketHub</h1>
        </Link>
      </Button>
      <Button asChild variant="outline">
        <Link href={ticketsPath()} className="text-sm">
          <h1>Tickets</h1>
        </Link>
      </Button>
    </nav>
  );
};

export default Header;
