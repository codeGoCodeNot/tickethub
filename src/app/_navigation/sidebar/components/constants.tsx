import {
  homePath,
  organizationPath,
  passwordPath,
  profilePath,
  ticketsByOrganizationPath,
  ticketsPath,
} from "@/path";
import {
  LucideBook,
  LucideBookCopy,
  LucideBuilding2,
  LucideKeyRound,
  LucideLibrary,
  LucideUser,
} from "lucide-react";
import { NavItem } from "../types";

export const ticketNavItems: NavItem[] = [
  {
    title: "All Tickets",
    icon: <LucideLibrary />,
    href: homePath(),
  },
  {
    title: "Our Tickets",
    icon: <LucideBookCopy />,
    href: ticketsByOrganizationPath(),
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

export const organizationNavItems: NavItem[] = [
  { title: "Overview", icon: <LucideBuilding2 />, href: organizationPath() },
];
