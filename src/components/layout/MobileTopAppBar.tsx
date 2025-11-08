import { useLocation } from "react-router-dom";

import { Menu } from "../../lib/icons";
import { Button } from "../ui/button";

const routeTitles: Record<string, string> = {
  "/chat": "Chat",
  "/models": "Modelle",
  "/roles": "Rollen",
  "/impressum": "Impressum",
  "/datenschutz": "Datenschutz",
};

interface MobileTopAppBarProps {
  onMenuToggle: () => void;
}

export function MobileTopAppBar({ onMenuToggle }: MobileTopAppBarProps) {
  const location = useLocation();
  const title = routeTitles[location.pathname] || "Disa AI";

  return (
    <header
      className="app-header fixed top-0 z-20 w-full border-b border-[color-mix(in_srgb,var(--color-border-focus)_35%,transparent)] bg-gradient-to-r from-[var(--acc2)]/16 via-[var(--surface-neumorphic-floating)] to-transparent backdrop-blur-xl shadow-[var(--shadow-neumorphic-sm)]"
      role="banner"
    >
      <div className="mx-auto flex h-16 max-w-[var(--max-content-width)] items-center justify-between px-4 pt-[env(safe-area-inset-top,0px)]">
        <h1 className="text-xl font-bold text-text-primary">{title}</h1>
        {/* Menu button with enhanced touch target */}
        <Button
          onClick={onMenuToggle}
          variant="accent"
          size="icon"
          aria-label="Menü öffnen"
          aria-expanded={false}
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </Button>
      </div>
    </header>
  );
}
