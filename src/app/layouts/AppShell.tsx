/* c8 ignore start */
import { type ReactNode, useCallback, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { AppMenuDrawer, MenuIcon, useMenuDrawer } from "../../components/layout/AppMenuDrawer";
import { MobileBackButton } from "../../components/navigation/MobileBackButton";
import { MobileBottomNav } from "../../components/navigation/MobileBottomNav";
import { PrimaryNavigation } from "../../components/navigation/PrimaryNavigation";
import {
  DRAWER_NAV_ITEMS,
  isNavItemActive,
  PRIMARY_NAV_ITEMS,
  SECONDARY_NAV_ITEMS,
} from "../../config/navigation";
import { Bookmark } from "../../lib/icons";
import { cn } from "../../lib/utils";
import { BrandWordmark } from "../components/BrandWordmark";

interface AppShellProps {
  children: ReactNode;
  pageHeaderTitle?: string;
  pageHeaderActions?: ReactNode;
}

interface AppShellLayoutProps {
  children: ReactNode;
  location: ReturnType<typeof useLocation>;
  pageHeaderTitle?: string;
  pageHeaderActions?: ReactNode;
}

export function AppShell({ children, pageHeaderTitle, pageHeaderActions }: AppShellProps) {
  const location = useLocation();
  return (
    <AppShellLayout
      location={location}
      pageHeaderTitle={pageHeaderTitle}
      pageHeaderActions={pageHeaderActions}
    >
      {children}
    </AppShellLayout>
  );
}

function AppShellLayout({
  children,
  location,
  pageHeaderTitle,
  pageHeaderActions,
}: AppShellLayoutProps) {
  const menuDrawer = useMenuDrawer();
  const navigate = useNavigate();
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

  const resolvedPageTitle = pageHeaderTitle ?? pageTitle;

  const isChatMode = location.pathname === "/" || location.pathname.startsWith("/chat");

  return (
    <div className="relative h-full min-h-screen-mobile bg-bg-app text-text-primary">
      <div className="relative flex h-full min-h-0 flex-col lg:flex-row">
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

        <aside className="hidden w-64 flex-shrink-0 border-r border-border-ink/20 bg-surface-2 lg:flex">
          <div className="flex h-full w-full flex-col gap-6 px-4 py-5">
            <BrandWordmark className="text-base" data-testid="brand-logo" />
            <PrimaryNavigation orientation="side" />
            <div className="mt-auto space-y-2 text-xs text-text-tertiary">
              <div className="flex flex-col gap-1">
                {SECONDARY_NAV_ITEMS.map((item) => (
                  <Link
                    key={item.id}
                    to={item.path}
                    className="rounded-lg px-3 py-2 transition hover:bg-surface-3"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <div
          className={cn(
            "flex min-h-0 flex-1 flex-col safe-area-bottom",
            isChatMode
              ? "pb-0"
              : "pb-[calc(var(--app-bottom-nav-height)+env(safe-area-inset-bottom,0px))] lg:pb-0",
          )}
        >
          {/* Header - Hidden in Chat Mode (Chat page provides its own header) */}
          {!isChatMode ? (
            <header className="sticky top-0 z-header h-[3.5rem] lg:h-[4rem] lg:hidden glass-header shadow-sm">
              <div className="flex h-full items-center gap-3 px-4 py-3 lg:px-6">
                <div className="flex flex-1 items-center gap-3 truncate">
                  <MobileBackButton />
                  <div className="flex items-center gap-2 truncate">
                    <BrandWordmark className="text-sm lg:hidden" data-testid="brand-logo" />
                    <span className="text-sm font-semibold text-text-primary truncate">
                      {pageTitle}
                    </span>
                  </div>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => void navigate("/chat/history")}
                    className={cn(
                      "relative flex items-center justify-center min-h-[44px] min-w-[44px] rounded-lg",
                      "text-ink-primary hover:bg-surface-2 transition-colors",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary",
                    )}
                    aria-label="Verlauf öffnen"
                  >
                    <Bookmark className="h-5 w-5" />
                  </button>
                  <MenuIcon onClick={menuDrawer.openMenu} />
                </div>
              </div>
            </header>
          ) : null}

          <div
            id={isChatMode ? undefined : "main"}
            role={isChatMode ? undefined : "main"}
            data-testid="app-main"
            key={location.pathname}
            // Remove background handling here for Chat Mode, BookLayout does it
            className={cn(
              "relative flex flex-1 flex-col min-h-0",
              isChatMode ? "bg-transparent" : "bg-bg-app",
            )}
            tabIndex={isChatMode ? undefined : -1}
          >
            <div
              className={cn(
                "mx-auto flex w-full flex-1 flex-col min-h-0",
                isChatMode
                  ? "w-full p-0 max-w-none" // Let BookLayout handle constraints
                  : "max-w-4xl overflow-y-auto px-4 py-6 sm:px-6 sm:py-8 header-compensation",
              )}
            >
              <div className={cn("flex flex-1 flex-col", isChatMode ? "h-full" : "gap-6")}>
                {!isChatMode && (resolvedPageTitle || pageHeaderActions) ? (
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    {resolvedPageTitle ? (
                      <div className="flex items-center gap-2">
                        <BrandWordmark className="text-sm text-text-secondary lg:hidden" />
                        <p className="text-lg font-semibold leading-tight text-text-primary sm:text-xl">
                          {resolvedPageTitle}
                        </p>
                      </div>
                    ) : null}
                    {pageHeaderActions ? (
                      <div className="flex flex-wrap gap-2 sm:justify-end">{pageHeaderActions}</div>
                    ) : null}
                  </div>
                ) : null}
                {children}
              </div>
            </div>
          </div>

          <AppMenuDrawer
            isOpen={menuDrawer.isOpen}
            onClose={menuDrawer.closeMenu}
            navItems={DRAWER_NAV_ITEMS}
            secondaryItems={[]}
          />
        </div>

        <MobileBottomNav />
      </div>
    </div>
  );
}
/* c8 ignore stop */
