import { type ReactNode, useCallback, useMemo } from "react";
import { NavLink, useLocation } from "react-router-dom";

import { BuildInfo } from "../../components/BuildInfo";
import { AppMenuDrawer, useMenuDrawer } from "../../components/layout/AppMenuDrawer";
import { NetworkBanner } from "../../components/NetworkBanner";
import { PWADebugInfo } from "../../components/pwa/PWADebugInfo";
import { PWAInstallPrompt } from "../../components/pwa/PWAInstallPrompt";
import { isNavItemActive, PRIMARY_NAV_ITEMS } from "../../config/navigation";
import { cn } from "../../lib/utils";
import { AppHeader } from "../../ui/AppHeader";

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

        <AppHeader pageTitle={pageTitle} onClickMenu={openMenu} />

        <nav
          aria-label="Primäre Navigation"
          className="sticky top-[var(--header-height)] z-10 bg-surface-2/90 backdrop-blur supports-[backdrop-filter]:bg-surface-2/80 border-b border-surface-2 shadow-raise"
        >
          <ul className="flex items-center gap-2 overflow-x-auto px-4 py-3 sm:px-6">
            {PRIMARY_NAV_ITEMS.map((item) => (
              <li key={item.id} className="flex-shrink-0">
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium min-h-[40px] min-w-[44px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-2",
                      isActive
                        ? "bg-surface-3 text-text-primary shadow-inset"
                        : "bg-surface-1 text-text-secondary hover:text-text-primary hover:bg-surface-2",
                    )
                  }
                >
                  <item.Icon className="h-4 w-4" aria-hidden />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

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
        {process.env.NODE_ENV === "development" && <PWADebugInfo />}

        <AppMenuDrawer isOpen={isOpen} onClose={closeMenu} />
      </div>
    </div>
  );
}
