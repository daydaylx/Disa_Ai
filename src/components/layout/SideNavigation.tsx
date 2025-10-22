import { Cpu, MessageCircle, Plus, Settings, Users } from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

import { BrandWordmark } from "../../app/components/BrandWordmark";
import { useStudio } from "../../app/state/StudioContext";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";

const navItems = [
  { to: "/chat", icon: MessageCircle, label: "Chat" },
  { to: "/models", icon: Cpu, label: "Modelle" },
  { to: "/roles", icon: Users, label: "Rollen" },
  { to: "/settings", icon: Settings, label: "Einstellungen" },
] as const;

export function SideNavigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { activeRole } = useStudio();

  const handleNewChat = () => {
    const timestamp = Date.now();
    void navigate("/chat", {
      state: { newChat: timestamp },
      replace: location.pathname === "/chat",
    });
  };

  return (
    <nav
      role="navigation"
      aria-label="Seitliche Hauptnavigation"
      className={cn(
        "border-border fixed left-0 top-0 z-40 h-full w-16 border-r",
        "bg-surface-base text-text-primary shadow-surface",
      )}
    >
      <div className="flex h-full flex-col">
        <div className="flex flex-col items-center gap-2 border-b border-border p-2">
          <BrandWordmark className="h-8 w-8 p-1" />
          {activeRole ? (
            <span
              className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-white/30 bg-white/25 text-[8px] font-semibold text-[var(--text-on-glass)]"
              title={activeRole.name}
            >
              {activeRole.name.charAt(0)}
            </span>
          ) : (
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-white/30 bg-white/20 text-[8px] font-medium">
              A
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col items-center gap-2 py-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex h-12 w-12 flex-col items-center justify-center rounded-full text-xs font-medium transition",
                  "text-[var(--text-on-glass)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--glass-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-bg)]",
                  isActive
                    ? "bg-[var(--glass-overlay-strong)] shadow-[var(--glass-shadow)] ring-1 ring-white/30 font-semibold"
                    : "opacity-80 hover:bg-[var(--glass-overlay-muted)] hover:opacity-100",
                )
              }
            >
              <item.icon className="h-5 w-5" aria-hidden="true" />
              <span className="sr-only">{item.label}</span>
            </NavLink>
          ))}
        </div>

        <div className="flex flex-col items-center gap-2 border-t border-border p-2">
          <Button
            variant="brand"
            size="icon"
            onClick={handleNewChat}
            aria-label="Neues Gespräch starten"
            className="h-10 w-10 rounded-full border border-border-subtle bg-surface-raised shadow-raised"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </nav>
  );
}