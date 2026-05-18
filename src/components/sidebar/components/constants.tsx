import { homePath, ticketsPath } from "@/path";
import { LucideBook, LucideLibrary } from "lucide-react";
import { NavItem } from "../types";

const navItems: NavItem[] = [
  {
    title: "All tickets",
    icon: <LucideLibrary />,
    href: homePath(),
  },
  {
    title: "My tickets",
    icon: <LucideBook />,
    href: ticketsPath(),
  },
];

export default navItems;
