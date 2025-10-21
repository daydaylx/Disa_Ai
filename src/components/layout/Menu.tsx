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

export function Menu() {
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
    <>
      <nav
        role="navigation"
        aria-label="Hauptnavigation"
        className={cn(
          "fixed bottom-0 left-0 right-0 z-40 border-t border-white/30",
          "bg-[var(--glass-bg)] text-[var(--text-on-glass)] shadow-[var(--glass-shadow)]",
          "supports-[backdrop-filter]:backdrop-saturate-125 backdrop-blur-[var(--glass-blur)]",
          "sm:bottom-auto sm:top-0 sm:border-b sm:border-t-0",
        )}
      >
        <div
          className={cn(
            "mx-auto flex w-full max-w-[var(--max-content-width)] items-center justify-around gap-1 px-4 py-2",
            "sm:justify-between sm:gap-6 sm:px-6 sm:py-3",
          )}
          style={{ paddingBottom: "calc(0.5rem + env(safe-area-inset-bottom, 0px))" }}
        >
          <div className="hidden items-center gap-3 text-sm font-medium sm:flex">
            <BrandWordmark />
            {activeRole ? (
              <span className="hidden rounded-full border border-white/30 bg-white/25 px-3 py-1 text-xs font-semibold text-[var(--text-on-glass)] sm:inline-flex">
                {activeRole.name}
              </span>
            ) : (
              <span className="hidden rounded-full border border-white/30 bg-white/20 px-3 py-1 text-xs font-medium sm:inline-flex">
                Assistive Studio
              </span>
            )}
          </div>

          <div
            className={cn(
              "flex flex-1 items-center justify-around gap-1",
              "sm:justify-center sm:gap-6 sm:px-4",
            )}
          >
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "flex h-12 flex-1 flex-col items-center justify-center gap-1 rounded-full px-3 text-xs font-medium transition sm:h-10 sm:flex-none sm:flex-row sm:gap-2 sm:px-4 sm:text-sm",
                    "text-[var(--text-on-glass)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--glass-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-bg)]",
                    isActive
                      ? "bg-[var(--glass-overlay-strong)] shadow-[var(--glass-shadow)] ring-1 ring-white/30 sm:font-semibold"
                      : "opacity-80 hover:bg-[var(--glass-overlay-muted)] hover:opacity-100",
                  )
                }
              >
                <item.icon className="h-5 w-5 sm:h-4 sm:w-4" aria-hidden="true" />
                <span className="text-xs sm:text-sm">{item.label}</span>
              </NavLink>
            ))}
          </div>

          <div className="hidden items-center gap-3 sm:flex">
            <Button
              variant="brand"
              size="sm"
              onClick={handleNewChat}
              aria-label="Neues Gespräch starten"
              className="shadow-[var(--glass-shadow)]"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              <span>Neu</span>
            </Button>
          </div>
        </div>
      </nav>

      <div className="fixed bottom-[76px] left-1/2 z-40 -translate-x-1/2 sm:hidden">
        <Button
          variant="brand"
          size="icon"
          onClick={handleNewChat}
          aria-label="Neues Gespräch starten"
          className="h-14 w-14 rounded-full border border-[var(--border-glass)] bg-[var(--glass-overlay-strong)] shadow-[var(--glass-shadow)] backdrop-blur-[var(--glass-blur)]"
        >
          <Plus className="h-6 w-6" aria-hidden="true" />
        </Button>
      </div>
    </>
  );
}
