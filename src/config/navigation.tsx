import type { LucideIcon } from "@/lib/icons";
import { Home, Settings, Users } from "@/lib/icons";

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
];

export const isNavItemActive = (item: AppNavItem, pathname: string) => {
  if (item.activePattern) {
    return item.activePattern.test(pathname);
  }
  return pathname === item.path;
};
