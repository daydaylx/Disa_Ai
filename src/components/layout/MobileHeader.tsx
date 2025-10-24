import { Menu } from "lucide-react";
import { useLocation } from "react-router-dom";

const routeTitles: Record<string, string> = {
  "/chat": "Chat",
  "/models": "Modelle",
  "/roles": "Rollen",
  "/impressum": "Impressum",
  "/datenschutz": "Datenschutz",
};

interface MobileHeaderProps {
  onMenuToggle: () => void;
}

export function MobileHeader({ onMenuToggle }: MobileHeaderProps) {
  const location = useLocation();
  const title = routeTitles[location.pathname] || "Disa AI";

  return (
    <header
      className="app-header bg-surface-base/90 fixed top-0 z-20 w-full border-b border-border backdrop-blur-xl"
      role="banner"
    >
      <div className="mx-auto flex h-16 max-w-[var(--max-content-width)] items-center justify-between px-4 pt-[env(safe-area-inset-top,0px)]">
        <h1 className="text-xl font-bold text-text-primary">{title}</h1>
        {/* Menu button with enhanced touch target */}
        <button
          onClick={onMenuToggle}
          className="touch-target-preferred h-10 w-10 rounded-full"
          aria-label="Menü öffnen"
          aria-expanded={false}
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
