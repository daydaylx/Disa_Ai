/* c8 ignore start */
import { type ReactNode, useCallback, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";

import { BuildInfo } from "../../components/BuildInfo";
import { AutoBreadcrumbs } from "../../components/navigation/Breadcrumbs";
import { MobileBackButton } from "../../components/navigation/MobileBackButton";
import { PrimaryNavigation } from "../../components/navigation/PrimaryNavigation";
import { isNavItemActive, PRIMARY_NAV_ITEMS, SECONDARY_NAV_ITEMS } from "../../config/navigation";
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

  const isChatMode = location.pathname === "/" || location.pathname.startsWith("/chat");

  return (
    <div className="relative min-h-screen bg-bg-base text-text-primary">
      <div className="relative flex min-h-screen flex-col lg:flex-row">
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
            setTimeout(() => focusMain(), 0);
          }}
        >
          Zum Hauptinhalt springen
        </a>

        <aside className="hidden w-64 flex-shrink-0 border-r border-border-ink/15 bg-bg-page/90 backdrop-blur lg:flex">
          <div className="flex h-full w-full flex-col gap-6 px-4 py-5">
            <BrandWordmark className="text-base" />
            <PrimaryNavigation orientation="side" />
            <div className="mt-auto space-y-2 text-xs text-ink-tertiary">
              <div className="flex flex-col gap-1">
                {SECONDARY_NAV_ITEMS.map((item) => (
                  <Link
                    key={item.id}
                    to={item.path}
                    className="rounded-lg px-3 py-2 transition hover:bg-surface-2"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              {process.env.NODE_ENV === "development" && (
                <div className="flex items-center gap-2 rounded-lg border border-border-ink/20 px-3 py-2 text-[11px]">
                  <span>Build</span>
                  <BuildInfo />
                </div>
              )}
            </div>
          </div>
        </aside>

        <div
          className="flex min-h-screen flex-1 flex-col"
          style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        >
          <header className="sticky top-0 z-header border-b border-border-ink/10 bg-bg-page/90 backdrop-blur">
            <div className="flex items-center gap-3 px-4 py-3 lg:px-6">
              <MobileBackButton />
              <div className="flex items-center gap-2 truncate">
                <BrandWordmark className="text-sm lg:hidden" />
                <span className="text-sm font-semibold text-ink-primary truncate">{pageTitle}</span>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <Link
                  to="/themen"
                  className="rounded-full border border-border-ink/40 px-3 py-1.5 text-xs font-medium text-ink-secondary hover:bg-surface-1"
                >
                  Quickstarts
                </Link>
                <Link
                  to="/feedback"
                  className="rounded-full bg-accent-primary/90 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-accent-primary"
                >
                  Feedback
                </Link>
              </div>
            </div>
            {!isChatMode && (
              <div className="border-t border-border-ink/10 bg-bg-page/80 px-4 pb-3 pt-2 lg:px-6">
                <AutoBreadcrumbs className="text-xs" />
              </div>
            )}
          </header>

          <div
            id="main"
            role="main"
            data-testid="app-main"
            key={location.pathname}
            className={cn(
              "relative flex flex-1 flex-col",
              isChatMode ? "bg-bg-page" : "bg-bg-base",
            )}
            tabIndex={-1}
          >
            <div
              className={cn(
                "mx-auto flex w-full flex-1 flex-col",
                isChatMode
                  ? "max-w-5xl overflow-hidden p-0"
                  : "max-w-4xl overflow-y-auto px-4 py-6 sm:px-6 sm:py-8",
              )}
            >
              <div className={cn("flex flex-1 flex-col", isChatMode ? "h-full" : "gap-6")}>
                {children}
              </div>
            </div>
          </div>

          <div className="border-t border-border-ink/15 bg-bg-page/95 backdrop-blur lg:hidden">
            <PrimaryNavigation orientation="bottom" />
          </div>
        </div>
      </div>
    </div>
  );
}
/* c8 ignore stop */
