import { type ReactNode, useMemo } from "react";
import { useLocation } from "react-router-dom";

import { BuildInfo } from "../../components/BuildInfo";
import {
  AppMenuDrawer,
  defaultMenuSections,
  MenuIcon,
  useMenuDrawer,
} from "../../components/layout/AppMenuDrawer";
import { NavPills } from "../../components/navigation/NavPills";
import { NetworkBanner } from "../../components/NetworkBanner";
import { PWADebugInfo } from "../../components/pwa/PWADebugInfo";
import { PWAInstallPrompt } from "../../components/pwa/PWAInstallPrompt";
import { isNavItemActive, PRIMARY_NAV_ITEMS } from "../../config/navigation";

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
  const { isOpen, openMenu, closeMenu } = useMenuDrawer();

  const { pageTitle } = useMemo(() => {
    const activeItem = PRIMARY_NAV_ITEMS.find((item) => isNavItemActive(item, location.pathname));
    return {
      pageTitle: activeItem?.label ?? "Studio",
    };
  }, [location.pathname]);

  return (
    <div className="relative min-h-screen bg-[var(--surface-base)] text-text-primary">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[var(--bg0)]" />
        <div
          className="absolute inset-0 opacity-90"
          style={{ backgroundImage: "var(--bg-gradient)" }}
        />
      </div>
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

        {/* Modern Header with PageShell pattern */}
        <header className="sticky top-0 z-20 border-b border-[var(--glass-border-soft)] bg-[var(--surface)]/80 backdrop-blur-xl safe-area-top">
          <div className="max-w-4xl mx-auto px-[var(--spacing-4)] py-[var(--spacing-3)] flex items-center justify-between">
            <div className="flex flex-col min-w-0">
              <span className="text-[var(--text-xs)] text-[var(--text-muted)] uppercase tracking-[0.16em]">
                Disa AI
              </span>
              <h1 className="text-[var(--text-2xl)] font-semibold text-[var(--text-primary)]">
                {pageTitle}
              </h1>
            </div>
            <MenuIcon onClick={openMenu} />
          </div>
        </header>

        <div className="border-b border-[var(--glass-border-soft)] bg-surface-base/40 backdrop-blur-xl">
          <NavPills items={PRIMARY_NAV_ITEMS} pathname={location.pathname} />
        </div>

        <main
          id="main"
          role="main"
          data-testid="app-main"
          key={location.pathname}
          className="relative flex flex-1 flex-col overflow-hidden"
        >
          <div className="mx-auto flex h-full w-full max-w-6xl flex-1 flex-col overflow-y-auto px-6 py-8 sm:px-10 sm:py-12">
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

        <AppMenuDrawer isOpen={isOpen} onClose={closeMenu} sections={defaultMenuSections} />
      </div>
    </div>
  );
}
