import { Bot, MessageCircle, Settings, Users } from "lucide-react";
import { NavLink } from "react-router-dom";

import { cn } from "../../lib/utils";

const navItems = [
  { path: "/chat", icon: MessageCircle, label: "Chat" },
  { path: "/roles", icon: Users, label: "Rollen" },
  { path: "/models", icon: Bot, label: "Modelle" },
  { path: "/settings", icon: Settings, label: "Einstellungen" },
];

export function MobileNavigation() {
  return (
    <nav
      className="bottom-navigation bg-[var(--color-surface-base)]/90 fixed bottom-0 z-20 w-full border-t border-[var(--color-border-hairline)] backdrop-blur-xl"
      role="navigation"
      aria-label="Hauptnavigation"
    >
      <div className="mx-auto flex h-16 max-w-[var(--max-content-width)] items-center justify-around px-4 pb-[env(safe-area-inset-bottom,0px)]">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "nav-item flex flex-col items-center justify-center text-sm font-medium transition-colors touch-target-preferred",
                isActive
                  ? "text-[var(--color-brand-primary)]"
                  : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]",
              )
            }
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
