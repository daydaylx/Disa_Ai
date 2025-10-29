import { MoreVertical, PanelTopDashed } from "lucide-react";
import { type ReactNode, useMemo, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

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
        <div
          className="flex items-center justify-between gap-3 px-4 pt-[env(safe-area-inset-top)]"
          style={{ height: "4.25rem" }}
        >
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[var(--color-text-tertiary)]">
              Disa AI
            </span>
            <h1 className="text-lg font-semibold text-[var(--color-text-primary)]">{title}</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-transparent text-[var(--color-text-secondary)] hover:border-[var(--color-border-subtle)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-action-primary-focus-ring)]"
              aria-label="Design-Roadmap"
              onClick={() => navigate("/design-directions")}
            >
              <PanelTopDashed className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-transparent text-[var(--color-text-secondary)] hover:border-[var(--color-border-subtle)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-action-primary-focus-ring)]"
              aria-label="Overflow-Menü öffnen"
              onClick={() => setIsOverflowOpen(true)}
            >
              <MoreVertical className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
        <nav
          className="overflow-x-auto border-t border-[var(--color-border-hairline)] px-2 py-2"
          role="tablist"
          aria-label="Hauptbereiche"
        >
          <ol className="flex min-w-full gap-2">
            {NAV_ITEMS.map((item) => (
              <li key={item.path} role="presentation">
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center justify-center rounded-[var(--radius-pill)] px-4 py-2 text-sm font-semibold transition-all",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-action-primary-focus-ring)]",
                      isActive
                        ? "bg-[var(--color-brand-primary)] text-[var(--color-brand-on-primary)] shadow-[var(--shadow-surface)]"
                        : "bg-transparent text-[var(--color-text-secondary)] border border-[var(--color-border-hairline)]",
                      !isActive &&
                        "hover:border-[var(--color-border-subtle)] hover:text-[var(--color-text-primary)]",
                    )
                  }
                  role="tab"
                  aria-selected={activePath === item.path}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ol>
        </nav>
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
                  <button
                    type="button"
                    className={cn(
                      "w-full rounded-[var(--radius-card-inner)] border px-4 py-3 text-left text-sm font-medium",
                      activePath === item.path
                        ? "border-[var(--color-brand-primary)] bg-[var(--color-brand-subtle)] text-[var(--color-brand-strong)]"
                        : "border-[var(--color-border-hairline)] hover:border-[var(--color-border-subtle)]",
                    )}
                    onClick={() => {
                      setIsOverflowOpen(false);
                      void navigate(item.path);
                    }}
                  >
                    {item.label}
                  </button>
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
                { label: "Impressum", path: "/impressum" },
                { label: "Datenschutz", path: "/datenschutz" },
              ].map((link) => (
                <button
                  key={link.path}
                  type="button"
                  className="w-full rounded-[var(--radius-card-inner)] border border-[var(--color-border-hairline)] px-4 py-2 text-left text-sm hover:border-[var(--color-border-subtle)]"
                  onClick={() => {
                    setIsOverflowOpen(false);
                    void navigate(link.path);
                  }}
                >
                  {link.label}
                </button>
              ))}
            </div>
          </section>
        </div>
      </DrawerSheet>
    </div>
  );
}
