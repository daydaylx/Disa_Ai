import { type ReactNode, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

import { BuildInfo } from "../../components/BuildInfo";
import { NavigationDrawer } from "../../components/layout/NavigationDrawer";
import { NetworkBanner } from "../../components/NetworkBanner";
import { PWADebugInfo } from "../../components/pwa/PWADebugInfo";
import { PWAInstallPrompt } from "../../components/pwa/PWAInstallPrompt";
import { isNavItemActive, PRIMARY_NAV_ITEMS } from "../../config/navigation";
import { Menu } from "../../lib/icons";

interface AppShellProps {
  children: ReactNode;
}

interface AppShellLayoutProps {
  children: ReactNode;
  location: ReturnType<typeof useLocation>;
}

export function AppShell({ children }: AppShellProps) {
  const location = useLocation();
  return <AppShellLayout location={location}>{children}</AppShellLayout>;
}

function AppShellLayout({ children, location }: AppShellLayoutProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { pageTitle, pageDescription } = useMemo(() => {
    const activeItem = PRIMARY_NAV_ITEMS.find((item) => isNavItemActive(item, location.pathname));
    if (activeItem) {
      return {
        pageTitle: activeItem.label,
        pageDescription: activeItem.description,
      };
    }

    const secondaryMap = [
      { pattern: /^\/more/, title: "Mehr", description: "Shortcuts, Support & Rechtliches" },
      { pattern: /^\/impressum/, title: "Impressum", description: "Verantwortlich für Inhalte" },
      {
        pattern: /^\/datenschutz/,
        title: "Datenschutz",
        description: "Informationen zur Verarbeitung",
      },
    ];

    const fallback = secondaryMap.find((entry) => entry.pattern.test(location.pathname));
    if (fallback) {
      return {
        pageTitle: fallback.title,
        pageDescription: fallback.description,
      };
    }

    return {
      pageTitle: "Studio",
      pageDescription: "Dashboard & Schnellstart",
    };
  }, [location.pathname]);

  return (
    <div className="relative min-h-screen bg-[var(--surface-base)] text-text-primary">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[var(--bg0)]" />
      <div
        className="relative flex min-h-screen flex-col"
        style={{
          paddingTop: "env(safe-area-inset-top, 0px)",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
          paddingLeft: "env(safe-area-inset-left, 0px)",
          paddingRight: "env(safe-area-inset-right, 0px)",
        }}
      >
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-skip-link focus:rounded focus:bg-accent focus:px-6 focus:py-4 focus:text-white focus:font-medium focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-accent tap-target min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          Zum Hauptinhalt springen
        </a>

        {/* Modern Header */}
        <header className="sticky top-0 z-20 border-b border-[var(--glass-border-soft)] bg-[var(--surface-card)]/80 backdrop-blur-xl safe-area-top">
          <div className="mx-auto flex w-full max-w-4xl items-center justify-between gap-4 px-4 py-4">
            <div className="min-w-0 space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                Disa AI
              </p>
              <div>
                <h1 className="text-2xl font-semibold text-[var(--text-primary)]">{pageTitle}</h1>
                {pageDescription && (
                  <p className="text-sm text-[var(--text-secondary)]">{pageDescription}</p>
                )}
              </div>
            </div>
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-2xl border border-[var(--glass-border-soft)] bg-[var(--surface)] text-[var(--text-secondary)] shadow-[var(--shadow-sm)] transition-colors hover:bg-[var(--surface-soft)] hover:text-[var(--text-primary)]"
              aria-label="Menü öffnen"
              aria-expanded={isDrawerOpen}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </header>

        <main
          id="main"
          role="main"
          data-testid="app-main"
          key={location.pathname}
          className="relative flex flex-1 flex-col overflow-hidden"
        >
          <div className="mx-auto flex h-full w-full max-w-5xl flex-1 flex-col overflow-y-auto px-4 py-6 sm:px-6">
            <div className="page-stack flex flex-1 flex-col gap-6">{children}</div>

            <footer className="mt-10 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-[var(--glass-border-soft)] bg-surface-panel/80 px-4 py-3 text-[11px] text-text-muted shadow-[var(--shadow-sm)]">
              <span>Disa AI · Build</span>
              <BuildInfo />
            </footer>
          </div>
        </main>

        <NetworkBanner />
        {location.pathname === "/" && <PWAInstallPrompt />}
        {process.env.NODE_ENV === "development" && <PWADebugInfo />}
      </div>

      {/* Navigation Drawer */}
      <NavigationDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </div>
  );
}
