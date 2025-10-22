import { Cpu, FileText, MessageCircle, Settings, Users } from "lucide-react";
import { NavLink } from "react-router-dom";

import { cn } from "../../lib/utils";

const navItems = [
  { to: "/chat", icon: MessageCircle, label: "Chat" },
  { to: "/models", icon: Cpu, label: "Modelle" },
  { to: "/roles", icon: Users, label: "Rollen" },
  { to: "/settings", icon: Settings, label: "Einstellungen" },
] as const;

const legalItems = [
  { to: "/impressum", label: "Impressum", icon: FileText },
  { to: "/datenschutz", label: "Datenschutz", icon: FileText },
];

export function BottomNavigation() {
  return (
    <nav
      role="navigation"
      aria-label="Mobile Hauptnavigation"
      className={cn(
        "bg-surface-base/80 fixed inset-x-0 bottom-0 z-50 border-t pb-[env(safe-area-inset-bottom,0px)] backdrop-blur-xl",
        "sm:hidden", // Only show on small screens
      )}
    >
      <div className="grid grid-cols-4 gap-1 p-2" role="tablist">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            role="tab"
            aria-selected={window.location.pathname === item.to}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center rounded-xl p-2 text-xs font-medium transition",
                "text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--glass-focus-ring)]",
                "h-14 min-h-14", // Reduced height
                "data-[state=active]:bg-[var(--glass-overlay-strong)] data-[state=active]:font-semibold data-[state=active]:text-text-primary",
                isActive
                  ? "bg-[var(--glass-overlay-strong)] font-semibold text-text-primary"
                  : "opacity-80 hover:bg-[var(--glass-overlay-muted)] hover:opacity-100",
              )
            }
          >
            <item.icon className="h-5 w-5" aria-hidden="true" /> {/* Reduced icon size */}
            <span className="mt-1 text-[0.75rem]">{item.label}</span> {/* Reduced text size */}
            <span className="sr-only">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

export function LegalBottomNavigation() {
  return (
    <nav
      role="navigation"
      aria-label="Mobile Rechtsnavigation"
      className={cn(
        "bg-surface-base/80 fixed inset-x-0 bottom-0 z-50 border-t pb-[env(safe-area-inset-bottom,0px)] backdrop-blur-xl",
        "sm:hidden", // Only show on small screens
      )}
    >
      <div className="grid grid-cols-2 gap-1 p-2" role="tablist">
        {legalItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            role="tab"
            aria-selected={window.location.pathname === item.to}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center rounded-xl p-2 text-xs font-medium transition",
                "text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--glass-focus-ring)]",
                "h-14 min-h-14", // Reduced height
                "data-[state=active]:bg-[var(--glass-overlay-strong)] data-[state=active]:font-semibold data-[state=active]:text-text-primary",
                isActive
                  ? "bg-[var(--glass-overlay-strong)] font-semibold text-text-primary"
                  : "opacity-80 hover:bg-[var(--glass-overlay-muted)] hover:opacity-100",
              )
            }
          >
            <item.icon className="h-5 w-5" aria-hidden="true" /> {/* Reduced icon size */}
            <span className="mt-1 text-[0.75rem]">{item.label}</span> {/* Reduced text size */}
            <span className="sr-only">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
