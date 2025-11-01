import { Bot, MessageCircle, Settings, Users } from "lucide-react";
import { NavLink } from "react-router-dom";

import { cn } from "../../lib/utils";

const navItems = [
  { path: "/chat", icon: MessageCircle, label: "Chat" },
  { path: "/roles", icon: Users, label: "Rollen" },
  { path: "/models", icon: Bot, label: "Modelle" },
  { path: "/settings", icon: Settings, label: "Einstellungen" },
];

interface MobileNavigationProps {
  variant?: "default" | "neumorphic" | "glass" | "floating";
}

export function MobileNavigation({ variant = "default" }: MobileNavigationProps) {
  const navClasses = {
    default:
      "bottom-navigation fixed bottom-0 z-20 w-full border-t border-[var(--color-border-hairline)] bg-surface-base backdrop-blur-xl shadow-[var(--shadow-surface)]",
    neumorphic:
      "bottom-navigation fixed bottom-0 z-20 w-full border-t border-[var(--border-neumorphic-subtle)] bg-[var(--surface-neumorphic-raised)] backdrop-blur-xl shadow-neo-md motion-safe:hover:shadow-neo-lg motion-safe:transition-shadow motion-safe:duration-200",
    glass:
      "bottom-navigation fixed bottom-0 z-20 w-full border-t border-[var(--color-border-hairline)]/40 bg-surface-base/80 backdrop-blur-2xl shadow-[var(--shadow-surface)] supports-[backdrop-filter]:bg-surface-base/60",
    floating:
      "bottom-navigation fixed bottom-0 z-20 w-full border-t border-[var(--color-border-hairline)]/30 bg-surface-base backdrop-blur-xl shadow-floating motion-safe:hover:shadow-elevated motion-safe:transition-shadow motion-safe:duration-200",
  };

  const getNavItemClasses = (isActive: boolean) => {
    const baseClasses =
      "nav-item flex flex-col items-center justify-center text-sm font-medium transition-all touch-target-preferred";

    const variantClasses = {
      default: isActive
        ? "text-[var(--color-brand-primary)]"
        : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]",
      neumorphic: isActive
        ? "text-[var(--color-brand-primary)] neo-raised-subtle p-2 rounded-lg shadow-neo-sm"
        : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:neo-raised-subtle hover:p-2 hover:rounded-lg hover:shadow-neo-sm motion-safe:transition-all motion-safe:duration-200",
      glass: isActive
        ? "text-[var(--color-brand-primary)] bg-brand/10 backdrop-blur-sm p-2 rounded-lg"
        : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-surface-subtle/40 hover:backdrop-blur-sm hover:p-2 hover:rounded-lg motion-safe:transition-all motion-safe:duration-200",
      floating: isActive
        ? "text-[var(--color-brand-primary)] shadow-floating p-2 rounded-lg bg-surface-raised"
        : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:shadow-floating hover:p-2 hover:rounded-lg hover:bg-surface-raised hover:-translate-y-[1px] motion-safe:transition-all motion-safe:duration-200",
    };

    return cn(baseClasses, variantClasses[variant]);
  };

  return (
    <nav className={navClasses[variant]} role="navigation" aria-label="Hauptnavigation">
      <div className="mx-auto flex h-16 max-w-[var(--max-content-width)] items-center justify-around px-4 pb-[env(safe-area-inset-bottom,0px)]">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => getNavItemClasses(isActive)}
            aria-label={item.label}
          >
            <item.icon className="nav-icon h-6 w-6" aria-hidden="true" />
            <span className="nav-label text-[11px] mt-1">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
