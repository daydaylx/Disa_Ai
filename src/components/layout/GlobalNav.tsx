import { useLocation } from "react-router-dom";

import { Menu } from "@/lib/icons";

import { cn } from "../../lib/utils";

const ROUTE_TITLES: Record<string, string> = {
  "/chat": "Chat",
  "/roles": "Rollen",
  "/models": "Modelle",
  "/settings": "Einstellungen",
  "/settings/api": "API-Key",
  "/settings/memory": "Verlauf & Gedächtnis",
  "/settings/filters": "Inhalte & Filter",
  "/settings/appearance": "Darstellung",
  "/settings/data": "Import & Export",
};

const NAV_ITEMS = [
  { path: "/chat", label: "Chat" },
  { path: "/roles", label: "Rollen" },
  { path: "/models", label: "Modelle" },
  { path: "/settings", label: "Einstellungen" },
  { path: "/settings/api", label: "API" },
  { path: "/settings/memory", label: "Verlauf" },
  { path: "/settings/filters", label: "Filter" },
  { path: "/settings/appearance", label: "Darstellung" },
  { path: "/settings/data", label: "Daten" },
];

interface GlobalNavProps {
  onMenuClick: () => void;
}

export function GlobalNav({ onMenuClick }: GlobalNavProps) {
  const location = useLocation();

  const title = ROUTE_TITLES[location.pathname] ?? "Disa AI";
  const activePath =
    NAV_ITEMS.find((item) => location.pathname.startsWith(item.path))?.path ?? "/chat";

  return (
    <header
      className={cn(
        // Aurora Premium Glass Header
        "sticky top-0 z-[var(--z-header)] relative",
        "bg-[var(--glass-surface-strong)] backdrop-blur-[var(--backdrop-blur-strong)]",
        "border-b border-[var(--glass-border-medium)] shadow-[var(--shadow-premium-medium)]",

        // Aurora Glass Overlay Effect
        "before:absolute before:inset-0 before:bg-gradient-to-r",
        "before:from-[var(--aurora-primary-500)]/8 before:to-[var(--aurora-lila-500)]/4",
        "before:pointer-events-none before:z-[-1]",

        // Mobile-optimized
        "transition-all duration-[var(--motion-medium)] ease-[var(--ease-aurora)]",
      )}
    >
      <div className="relative flex items-center justify-between gap-[var(--space-inline-sm)] px-[var(--space-lg)] py-[var(--space-sm)] pt-[calc(var(--space-sm)+env(safe-area-inset-top))]">
        {/* Aurora Brand Section */}
        <div className="flex flex-col gap-[var(--space-stack-xs)] relative z-10">
          {/* Aurora Brand Label */}
          <span
            className={cn(
              "text-[var(--text-xs)] font-semibold uppercase tracking-[0.4em]",
              "text-[var(--text-muted)] drop-shadow-sm",
            )}
          >
            Disa AI
          </span>

          {/* Aurora Title Section */}
          <div>
            <h1
              className={cn(
                "text-[var(--text-xl)] font-semibold leading-[var(--leading-tight)]",
                "text-[var(--text-primary)] drop-shadow-sm",
              )}
            >
              {title}
            </h1>
            <p
              className={cn(
                "text-[var(--text-xs)] text-[var(--text-secondary)]",
                "drop-shadow-sm mt-[var(--space-stack-xs)]",
              )}
            >
              {ROUTE_TITLES[activePath] ?? "Mobile Studio"}
            </p>
          </div>
        </div>

        {/* Aurora Glass Menu Button */}
        <div className="flex items-center gap-[var(--space-inline-xs)] relative z-10">
          <button
            type="button"
            className={cn(
              // Aurora Glass Button Base
              "flex items-center justify-center rounded-[var(--radius-xl)]",
              "bg-[var(--glass-surface-medium)] backdrop-blur-[var(--backdrop-blur-strong)]",
              "border border-[var(--glass-border-medium)] shadow-[var(--shadow-glow-soft)]",
              "text-[var(--text-secondary)]",

              // Aurora Touch-Optimized
              "size-[var(--touch-target-comfortable)] min-h-[var(--touch-target-comfortable)]",
              "select-none touch-manipulation",

              // Aurora Premium Interactive States
              "transition-all duration-[var(--motion-medium)] ease-[var(--ease-aurora)]",
              "hover:bg-[var(--glass-surface-strong)] hover:border-[var(--glass-border-aurora)]",
              "hover:text-[var(--text-primary)] hover:shadow-[var(--shadow-glow-primary)]",
              "hover:scale-105 active:scale-95",

              // Aurora Focus States
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]",
              "focus-visible:shadow-[var(--shadow-glow-primary)]",
            )}
            aria-label="Hauptmenü öffnen"
            onClick={onMenuClick}
          >
            <Menu
              className="h-5 w-5 transition-transform duration-[var(--motion-medium)]"
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
    </header>
  );
}

export { NAV_ITEMS, ROUTE_TITLES };
