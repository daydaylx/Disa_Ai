import { Menu } from "lucide-react";
import { useLocation } from "react-router-dom";

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

  const headerClass =
    "sticky top-0 z-40 border-b border-[var(--border-neumorphic-dark)] bg-[var(--surface-neumorphic-floating)] backdrop-blur-md shadow-[var(--shadow-inset-subtle)]";

  const menuButtonClass =
    "flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border-neumorphic-subtle)] bg-[var(--surface-neumorphic-raised)] text-[var(--color-text-secondary)] shadow-neo-sm transition-all duration-200 hover:-translate-y-[1px] hover:shadow-neo-md active:translate-y-[1px] active:shadow-[var(--shadow-inset-subtle)] focus-visible:shadow-focus-neo focus-visible:outline-none";

  return (
    <header className={headerClass}>
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
            className={menuButtonClass}
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
