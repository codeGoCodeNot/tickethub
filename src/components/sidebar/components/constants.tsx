import { homePath, passwordPath, profilePath, ticketsPath } from "@/path";
import { LucideBook, LucideKeyRound, LucideLibrary, LucideUser } from "lucide-react";
import { NavItem } from "../types";

export const ticketNavItems: NavItem[] = [
  {
    title: "All Tickets",
    icon: <LucideLibrary />,
    href: homePath(),
  },
  {
    title: "My Tickets",
    icon: <LucideBook />,
    href: ticketsPath(),
  },
];

export const accountNavItems: NavItem[] = [
  {
    title: "Profile",
    icon: <LucideUser />,
    href: profilePath(),
  },
  {
    title: "Password",
    icon: <LucideKeyRound />,
    href: passwordPath(),
  },
];
