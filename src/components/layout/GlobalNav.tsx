import { Menu } from "lucide-react";
import { useLocation } from "react-router-dom";

import { Button } from "../ui/button";

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
    "sticky top-0 z-40 border-b border-[color-mix(in_srgb,var(--color-border-focus)_35%,transparent)] bg-gradient-to-r from-[var(--acc2)]/14 via-[var(--surface-neumorphic-floating)] 70% to-transparent backdrop-blur-lg supports-[backdrop-filter]:backdrop-blur-md shadow-[var(--shadow-neumorphic-sm)]";

  return (
    <header
      className={headerClass}
      style={{
        background:
          "linear-gradient(90deg, color-mix(in srgb, var(--acc2) 18%, transparent) 0%, color-mix(in srgb, var(--surface-neumorphic-floating) 92%, transparent) 55%, transparent 100%)",
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
          <Button
            type="button"
            variant="accent"
            size="icon"
            onClick={onMenuClick}
            aria-label="Hauptmenü öffnen"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </header>
  );
}

export { NAV_ITEMS, ROUTE_TITLES };
