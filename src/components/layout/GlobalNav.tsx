import { Menu, PanelTopDashed } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

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
  "/design-directions": "Design Matrix",
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
  variant?: "default" | "neumorphic" | "glass" | "floating";
}

export function GlobalNav({ onMenuClick, variant = "default" }: GlobalNavProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const title = ROUTE_TITLES[location.pathname] ?? "Disa AI";
  const activePath =
    NAV_ITEMS.find((item) => location.pathname.startsWith(item.path))?.path ?? "/chat";

  const headerClasses = {
    default:
      "sticky top-0 z-40 border-b border-[var(--color-border-hairline)] bg-surface-base backdrop-blur-lg shadow-[var(--shadow-surface)]",
    neumorphic:
      "sticky top-0 z-40 border-b border-[var(--border-neumorphic-subtle)] bg-[var(--surface-neumorphic-raised)] backdrop-blur-lg shadow-neo-md",
    glass:
      "sticky top-0 z-40 border-b border-[var(--color-border-hairline)]/40 bg-surface-base/80 backdrop-blur-xl shadow-[var(--shadow-surface)] supports-[backdrop-filter]:bg-surface-base/60",
    floating:
      "sticky top-0 z-40 border-b border-[var(--color-border-hairline)]/30 bg-surface-base shadow-floating backdrop-blur-lg motion-safe:hover:shadow-elevated motion-safe:transition-shadow motion-safe:duration-200",
  };

  const buttonClasses = {
    default:
      "flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-border-hairline)] bg-card/70 text-[var(--color-text-secondary)] shadow-[var(--shadow-surface)] transition-all hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-action-primary-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]",
    neumorphic:
      "neo-button-base flex h-11 w-11 items-center justify-center rounded-full text-[var(--color-text-secondary)] transition-[box-shadow,transform] hover:shadow-neo-lg active:shadow-inset-subtle focus-visible:shadow-focus-neo focus-visible:outline-none",
    glass:
      "flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-border-hairline)]/40 bg-card/40 backdrop-blur-md text-[var(--color-text-secondary)] shadow-[var(--shadow-surface)] transition-all hover:bg-card/60 supports-[backdrop-filter]:bg-card/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-action-primary-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]",
    floating:
      "flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-border-hairline)] bg-card shadow-floating text-[var(--color-text-secondary)] transition-all hover:shadow-elevated hover:-translate-y-[2px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-action-primary-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]",
  };

  return (
    <header className={headerClasses[variant]}>
      <div className="flex items-center justify-between gap-3 px-4 py-3 pt-[env(safe-area-inset-top)]">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[var(--color-text-tertiary)]">
            Disa AI
          </span>
          <div>
            <h1 className="text-xl font-semibold text-[var(--color-text-primary)] leading-tight">
              {title}
            </h1>
            <p className="text-xs text-[var(--color-text-secondary)]">
              {ROUTE_TITLES[activePath] ?? "Mobile Studio"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className={buttonClasses[variant]}
            onClick={() => navigate("/design-directions")}
          >
            <PanelTopDashed className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            className={buttonClasses[variant]}
            aria-label="Hauptmenü öffnen"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
}

export { NAV_ITEMS, ROUTE_TITLES };
