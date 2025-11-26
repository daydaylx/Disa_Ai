/* c8 ignore start */
import { type ReactNode, useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";

import { BuildInfo } from "../../components/BuildInfo";
import { AppMenuDrawer, MenuIcon, useMenuDrawer } from "../../components/layout/AppMenuDrawer";
import { NekoLayer } from "../../components/neko/NekoLayer";
import { NetworkBanner } from "../../components/NetworkBanner";
import { PWADebugInfo } from "../../components/pwa/PWADebugInfo";
import { PWAInstallPrompt } from "../../components/pwa/PWAInstallPrompt";
import { isNavItemActive, PRIMARY_NAV_ITEMS } from "../../config/navigation";
import { BrandWordmark } from "../components/BrandWordmark";

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
  const focusMain = useCallback(() => {
    const mainEl = document.getElementById("main");
    if (!mainEl) return;
    if (!mainEl.hasAttribute("tabindex")) {
      mainEl.setAttribute("tabindex", "-1");
    }
    mainEl.focus({ preventScroll: false });
  }, []);

  const pageTitle = useMemo(() => {
    const active = PRIMARY_NAV_ITEMS.find((item) => isNavItemActive(item, location.pathname));
    return active?.label ?? "Disa AI";
  }, [location.pathname]);

  return (
    <div className="relative min-h-screen text-text-primary">
      {/* Aurora Background - Restore animated identity */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden brand-aurora aurora-animated">
        {/* Fallback/Overlay for depth */}
        <div className="absolute inset-0 bg-[var(--bg0)]/30 mix-blend-overlay" />
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
          onClick={(event) => {
            event.preventDefault();
            focusMain();
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              focusMain();
            }
          }}
          onFocus={() => {
            // Fokussiere den Hauptbereich sofort, damit Screenreader/Tests den Sprung bemerken
            setTimeout(() => focusMain(), 0);
          }}
        >
          Zum Hauptinhalt springen
        </a>

        {/* Compact Top Header */}
        <header className="sticky top-0 z-header border-b border-surface-2 bg-surface-2/90 backdrop-blur supports-[backdrop-filter]:bg-surface-2/80 shadow-raise">
          <div
            className="flex items-center gap-3 px-4 py-3"
            style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 8px)" }}
          >
            <BrandWordmark />
            <span className="h-6 w-px bg-surface-1 shadow-inset" aria-hidden />
            <span className="text-base font-semibold text-text-primary truncate">{pageTitle}</span>
            <div className="ml-auto">
              <MenuIcon onClick={openMenu} />
            </div>
          </div>
        </header>

        <div
          id="main"
          role="main"
          data-testid="app-main"
          key={location.pathname}
          className="relative flex flex-1 flex-col overflow-hidden"
          tabIndex={-1}
        >
          <div className="mx-auto flex h-full w-full max-w-6xl flex-1 flex-col overflow-y-auto px-6 py-8 sm:px-10 sm:py-12">
            <div className="page-stack flex flex-1 flex-col gap-6">{children}</div>

            {/* Footer - Only show in development */}
            {process.env.NODE_ENV === "development" && (
              <footer className="mt-10 flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-surface-inset shadow-inset px-4 py-3 text-[11px] text-text-muted">
                <span>Disa AI · Build</span>
                <BuildInfo />
              </footer>
            )}
          </div>
        </div>

        <NetworkBanner />
        {location.pathname === "/" && <PWAInstallPrompt />}
        <NekoLayer />
        {process.env.NODE_ENV === "development" && <PWADebugInfo />}

        <AppMenuDrawer isOpen={isOpen} onClose={closeMenu} />
      </div>
    </div>
  );
}
/* c8 ignore stop */
