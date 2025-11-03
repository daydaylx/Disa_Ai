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
    "sticky top-0 z-40 border-b border-[var(--color-border-subtle)] bg-[var(--surface-neumorphic-floating)] backdrop-blur-sm supports-[backdrop-filter]:backdrop-blur-md";

  const menuButtonClass =
    "flex h-10 w-10 items-center justify-center rounded-2xl border border-[color-mix(in_srgb,var(--color-border-subtle)_60%,transparent)] bg-[color-mix(in_srgb,var(--surface-neumorphic-floating)_85%,transparent)] text-[var(--color-text-secondary)] shadow-[var(--shadow-depth-1)] transition-transform duration-150 hover:-translate-y-[1px] hover:shadow-[var(--shadow-depth-2)] active:translate-y-[1px] active:shadow-none focus-visible:shadow-[var(--shadow-focus)] focus-visible:outline-none";

  return (
    <header
      className={headerClass}
      style={{
        background: "color-mix(in srgb, var(--surface-neumorphic-floating) 92%, transparent)",
      }}
    >
      <div className="flex items-center justify-between gap-3 px-4 pb-3 pt-[calc(env(safe-area-inset-top)+0.5rem)]">
        <div className="flex flex-col gap-0.5">
          <span className="text-[11px] font-medium text-[var(--color-text-tertiary)]">Disa AI</span>
          <h1 className="text-lg font-semibold leading-tight text-[var(--color-text-primary)]">
            {title}
          </h1>
          <p className="text-[12px] text-[var(--color-text-secondary)]">
            {ROUTE_TITLES[activePath] ?? "Mobile Studio"}
          </p>
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
