import { Menu, PanelTopDashed } from "lucide-react";
import { type ReactNode, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { BuildInfo } from "../../components/BuildInfo";
import { NetworkBanner } from "../../components/NetworkBanner";
import { PWADebugInfo } from "../../components/pwa/PWADebugInfo";
import { PWAInstallPrompt } from "../../components/pwa/PWAInstallPrompt";
import { DrawerSheet } from "../../components/ui/drawer-sheet";
import { cn } from "../../lib/utils";

interface MobileAppShellProps {
  children: ReactNode;
}
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

export function MobileAppShell({ children }: MobileAppShellProps) {
  const location = useLocation();
  return <MobileAppShellLayout location={location}>{children}</MobileAppShellLayout>;
}

interface MobileAppShellLayoutProps {
  children: ReactNode;
  location: ReturnType<typeof useLocation>;
}

function MobileAppShellLayout({ children, location }: MobileAppShellLayoutProps) {
  const navigate = useNavigate();
  const [isOverflowOpen, setIsOverflowOpen] = useState(false);

  const title = ROUTE_TITLES[location.pathname] ?? "Disa AI";
  const activePath = useMemo(() => {
    return NAV_ITEMS.find((item) => location.pathname.startsWith(item.path))?.path ?? "/chat";
  }, [location.pathname]);

  return (
    <div
      className="relative flex min-h-[100dvh] flex-col bg-[var(--color-surface-canvas)] text-[var(--color-text-primary)]"
      style={{ minHeight: "calc(100dvh + var(--keyboard-height, 0px))" }}
    >
      <header className="sticky top-0 z-40 border-b border-[var(--color-border-hairline)] bg-[var(--color-surface-base)]/90 backdrop-blur-lg">
        <div className="flex items-center justify-between gap-3 px-4 py-3 pt-[env(safe-area-inset-top)]">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[var(--color-text-tertiary)]">
              Disa AI
            </span>
            <div>
              <h1 className="text-token-h1 text-[var(--color-text-primary)] leading-tight">
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
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-border-hairline)] bg-[var(--color-surface-card)]/70 text-[var(--color-text-secondary)] shadow-[var(--shadow-surface)] transition-all hover:bg-[var(--color-surface-card)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-action-primary-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]"
              aria-label="Design-Roadmap"
              onClick={() => navigate("/design-directions")}
            >
              <PanelTopDashed className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-border-hairline)] bg-[var(--color-surface-card)]/70 text-[var(--color-text-secondary)] shadow-[var(--shadow-surface)] transition-all hover:bg-[var(--color-surface-card)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-action-primary-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]"
              aria-label="Hauptmenü öffnen"
              onClick={() => setIsOverflowOpen(true)}
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <main
        id="main"
        key={location.pathname}
        className="min-h-0 flex flex-1 flex-col overflow-y-auto px-4 pb-[calc(2rem+env(safe-area-inset-bottom))] pt-4"
      >
        <div className="mx-auto flex w-full max-w-[var(--max-content-width,480px)] flex-1 flex-col">
          {children}
        </div>
      </main>

      <footer className="border-t border-[var(--color-border-hairline)] bg-[var(--color-surface-base)] px-4 py-4 text-xs text-[var(--color-text-secondary)]">
        <div className="mx-auto flex w-full max-w-[var(--max-content-width,480px)] flex-col gap-2 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <div className="flex flex-col gap-1 sm:flex-row sm:gap-3">
            <span>Mobile Studio Preview</span>
            <span className="hidden sm:inline" aria-hidden="true">
              ·
            </span>
            <a href="/datenschutz" className="text-[var(--color-text-link)] hover:underline">
              Datenschutz
            </a>
          </div>
          <BuildInfo className="text-[11px] sm:text-xs" />
        </div>
      </footer>

      <NetworkBanner />
      <PWAInstallPrompt />
      {process.env.NODE_ENV === "development" && <PWADebugInfo />}

      <DrawerSheet title="Mehr" isOpen={isOverflowOpen} onClose={() => setIsOverflowOpen(false)}>
        <div className="space-y-4">
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-text-tertiary)]">
              Navigation
            </h3>
            <ul className="mt-2 space-y-2">
              {NAV_ITEMS.map((item) => (
                <li key={`drawer-${item.path}`}>
                  <Link
                    to={item.path}
                    className={cn(
                      "block w-full rounded-[var(--radius-card-inner)] border px-4 py-3 text-left text-sm font-medium transition-colors",
                      activePath === item.path
                        ? "border-[var(--color-brand-primary)] bg-[var(--color-brand-subtle)] text-[var(--color-brand-strong)]"
                        : "border-[var(--color-border-hairline)] hover:border-[var(--color-border-subtle)]",
                    )}
                    onClick={() => setIsOverflowOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-text-tertiary)]">
              Sekundäre Seiten
            </h3>
            <div className="mt-2 grid gap-2">
              {[
                { label: "Design Matrix", path: "/design-directions" },
                { label: "Design Matrix · Option B", path: "/design-directions#B" },
                { label: "Impressum", path: "/impressum" },
                { label: "Datenschutz", path: "/datenschutz" },
              ].map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="block w-full rounded-[var(--radius-card-inner)] border border-[var(--color-border-hairline)] px-4 py-2 text-left text-sm hover:border-[var(--color-border-subtle)]"
                  onClick={() => setIsOverflowOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </section>
        </div>
      </DrawerSheet>
    </div>
  );
}
