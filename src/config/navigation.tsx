import type { LucideIcon } from "@/lib/icons";
import { Brain, Cpu, Home, MessageSquare, Settings, Users } from "@/lib/icons";

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
    path: "/chat",
    Icon: Home,
    activePattern: /^\/(chat|$)(?!history)/,
    description: "Unterhaltungen & KI-Assistenz",
  },

  {
    id: "models",
    label: "Modelle",
    path: "/models",
    Icon: Cpu,
    activePattern: /^\/models/,
    description: "Modelle & Leistungsprofile",
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

export const SECONDARY_NAV_ITEMS: AppNavItem[] = [
  {
    id: "themen",
    label: "Themen",
    path: "/themen",
    Icon: Brain,
    activePattern: /^\/themen$/,
    description: "Diskussionsthemen & Quickstarts",
  },
  {
    id: "feedback",
    label: "Feedback",
    path: "/feedback",
    Icon: MessageSquare,
    activePattern: /^\/feedback/,
    description: "Melde Ideen & Fehler",
  },
];

export const isNavItemActive = (item: AppNavItem, pathname: string) => {
  if (item.activePattern) {
    return item.activePattern.test(pathname);
  }
  return pathname === item.path;
};
