import type { LucideIcon } from "lucide-react";
import { Cpu, Home, MessageSquare, Settings, Users } from "lucide-react";

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
    id: "studio",
    label: "Studio",
    path: "/",
    Icon: Home,
    activePattern: /^\/?$/,
    description: "Dashboard & Schnellstart",
  },
  {
    id: "chat",
    label: "Chat",
    path: "/chat",
    Icon: MessageSquare,
    activePattern: /^\/chat/,
    description: "Unterhaltungen & Verlauf",
  },
  {
    id: "models",
    label: "Modelle",
    path: "/models",
    Icon: Cpu,
    activePattern: /^\/models/,
    description: "Katalog & Bewertungen",
  },
  {
    id: "roles",
    label: "Rollen",
    path: "/roles",
    Icon: Users,
    activePattern: /^\/roles/,
    description: "Persona-Templates",
  },
  {
    id: "settings",
    label: "Einstellungen",
    path: "/settings",
    Icon: Settings,
    activePattern: /^\/settings/,
    description: "API, Daten & Darstellung",
  },
];

export const isNavItemActive = (item: AppNavItem, pathname: string) => {
  if (item.activePattern) {
    return item.activePattern.test(pathname);
  }
  return pathname === item.path;
};
