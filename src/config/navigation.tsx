import type { LucideIcon } from "@/lib/icons";
import { Brain, Home, Settings, Users } from "@/lib/icons";

export type AppNavItem = {
  id: string;
  label: string;
  path: string;
  Icon: LucideIcon;
  activePattern?: RegExp;
  description?: string;
};

export const PRIMARY_NAV_ITEMS: AppNavItem[] = [
  {
    id: "chat",
    label: "Chat",
    path: "/",
    Icon: Home,
    activePattern: /^\/(chat)?$/,
    description: "Unterhaltungen & KI-Assistenz",
  },
  {
    id: "roles",
    label: "Rollen",
    path: "/roles",
    Icon: Users,
    activePattern: /^\/roles/,
    description: "Persona-Katalog & Templates",
  },
  {
    id: "settings",
    label: "Einstellungen",
    path: "/settings",
    Icon: Settings,
    activePattern: /^\/settings/,
    description: "API, Modelle & Darstellung",
  },
  {
    id: "themen",
    label: "Themen",
    path: "/themen",
    Icon: Brain,
    activePattern: /^\/themen$/,
    description: "Diskussionsthemen & Quickstarts",
  },
];

export const isNavItemActive = (item: AppNavItem, pathname: string) => {
  if (item.activePattern) {
    return item.activePattern.test(pathname);
  }
  return pathname === item.path;
};
