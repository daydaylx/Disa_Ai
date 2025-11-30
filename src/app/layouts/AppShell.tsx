/* c8 ignore start */
import { type ReactNode, useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";

import { BuildInfo } from "../../components/BuildInfo";
import { AppMenuDrawer, MenuIcon, useMenuDrawer } from "../../components/layout/AppMenuDrawer";
import { AutoBreadcrumbs } from "../../components/navigation/Breadcrumbs";
import { MobileBackButton } from "../../components/navigation/MobileBackButton";
import { NekoLayer } from "../../components/neko/NekoLayer";
import { NetworkBanner } from "../../components/NetworkBanner";
import { PWADebugInfo } from "../../components/pwa/PWADebugInfo";
import { PWAInstallPrompt } from "../../components/pwa/PWAInstallPrompt";
import { isNavItemActive, PRIMARY_NAV_ITEMS } from "../../config/navigation";
import { cn } from "../../lib/utils";
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

  const isChatMode = location.pathname === "/" || location.pathname === "/chat";

  return (
    <div className="relative min-h-screen bg-bg-base text-text-primary">
      {/* Clean solid background - no Aurora animation */}

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

        {/* Minimal Top Header - Mobile-First */}
        <header className="sticky top-0 z-header bg-bg-page/95 backdrop-blur-sm border-b border-border-ink/10">
          <div
            className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5"
            style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 4px)" }}
          >
            <MobileBackButton />
            {/* Brand only on non-chat pages or desktop */}
            {!isChatMode && (
              <>
                <BrandWordmark className="text-sm" />
                <span className="text-ink-tertiary mx-1">·</span>
              </>
            )}
            <span className="text-sm font-medium text-ink-primary truncate flex-1">
              {pageTitle}
            </span>
            <MenuIcon onClick={openMenu} />
          </div>
        </header>

        {/* Breadcrumb Navigation - compact on all screens */}
        {!isChatMode && (
          <div className="border-b border-border-ink/5 bg-bg-page/50">
            <div className="px-3 py-1.5 sm:px-4 max-w-6xl mx-auto">
              <AutoBreadcrumbs className="text-xs" />
            </div>
          </div>
        )}

        <div
          id="main"
          role="main"
          data-testid="app-main"
          key={location.pathname}
          className="relative flex flex-1 flex-col overflow-hidden"
          tabIndex={-1}
        >
          <div
            className={cn(
              "mx-auto flex h-full w-full flex-1 flex-col",
              isChatMode
                ? "p-0 overflow-hidden" // Chat mode: full width, no padding, no shell scroll
                : "max-w-4xl overflow-y-auto px-4 py-6 sm:px-6 sm:py-8", // Default mode - tighter on mobile
            )}
          >
            <div className={cn("flex flex-1 flex-col", isChatMode ? "h-full" : "page-stack gap-6")}>
              {children}
            </div>

            {/* Footer - Only show in development AND NOT in Chat mode */}
            {process.env.NODE_ENV === "development" && !isChatMode && (
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
