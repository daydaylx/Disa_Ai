/* c8 ignore start */
import { type ReactNode, useCallback, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";

import { AppMenuDrawer, MenuIcon, useMenuDrawer } from "../../components/layout/AppMenuDrawer";
import { MobileBackButton } from "../../components/navigation/MobileBackButton";
import { PrimaryNavigation } from "../../components/navigation/PrimaryNavigation";
import { isNavItemActive, PRIMARY_NAV_ITEMS, SECONDARY_NAV_ITEMS } from "../../config/navigation";
import { Brain, Cpu, Info, MessageSquare, Settings, Users } from "../../lib/icons";
import { cn } from "../../lib/utils";
import { BrandWordmark } from "../components/BrandWordmark";

const HAMBURGER_NAV_ITEMS = [
  { id: "models", label: "Models", path: "/models", Icon: Cpu, activePattern: /^\/models/ },
  { id: "roles", label: "Rollen", path: "/roles", Icon: Users, activePattern: /^\/roles/ },
  {
    id: "settings",
    label: "Einstellungen",
    path: "/settings",
    Icon: Settings,
    activePattern: /^\/settings/,
  },
  {
    id: "quickstarts",
    label: "Quickstarts",
    path: "/themen",
    Icon: Brain,
    activePattern: /^\/themen/,
  },
  {
    id: "feedback",
    label: "Feedback",
    path: "/feedback",
    Icon: MessageSquare,
    activePattern: /^\/feedback/,
  },
  { id: "about", label: "Über", path: "/impressum", Icon: Info, activePattern: /^\/impressum/ },
] satisfies typeof PRIMARY_NAV_ITEMS;

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
  const menuDrawer = useMenuDrawer();
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
    <div className="relative min-h-screen-mobile bg-bg-app text-text-primary">
      <div className="relative flex min-h-screen-mobile flex-col lg:flex-row">
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
            <BrandWordmark className="text-base" />
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

        <div className="flex min-h-screen-mobile flex-1 flex-col safe-area-bottom">
          {/* Header - Clean for Chat Mode (Hidden in Chat, BookLayout handles it) */}
          <header
            className={cn(
              "sticky top-0 z-header h-[3.5rem] lg:h-[4rem] border-b border-border-ink/30 bg-surface-2/95 backdrop-blur",
              // Hide AppShell header on mobile AND desktop for Chat Mode, as BookLayout has its own
              isChatMode ? "hidden" : "lg:hidden",
            )}
          >
            <div className="flex h-full items-center gap-3 px-4 py-3 lg:px-6">
              <div className="flex flex-1 items-center gap-3 truncate">
                <MobileBackButton />
                <div className="flex items-center gap-2 truncate">
                  <BrandWordmark className="text-sm lg:hidden" />
                  <span className="text-sm font-semibold text-text-primary truncate">
                    {pageTitle}
                  </span>
                </div>
              </div>
              <MenuIcon onClick={menuDrawer.openMenu} className="ml-auto" />
            </div>
          </header>

          <div
            id="main"
            role="main"
            data-testid="app-main"
            key={location.pathname}
            // Remove background handling here for Chat Mode, BookLayout does it
            className={cn(
              "relative flex flex-1 flex-col",
              isChatMode ? "bg-transparent" : "bg-bg-app",
            )}
            tabIndex={-1}
          >
            <div
              className={cn(
                "mx-auto flex w-full flex-1 flex-col",
                isChatMode
                  ? "w-full p-0 max-w-none overflow-hidden" // Let BookLayout handle constraints
                  : "max-w-4xl overflow-y-auto px-4 py-6 sm:px-6 sm:py-8 header-compensation",
              )}
            >
              <div className={cn("flex flex-1 flex-col", isChatMode ? "h-full" : "gap-6")}>
                {children}
              </div>
            </div>
          </div>

          <AppMenuDrawer
            isOpen={menuDrawer.isOpen}
            onClose={menuDrawer.closeMenu}
            navItems={HAMBURGER_NAV_ITEMS}
            secondaryItems={[]}
          />
        </div>
      </div>
    </div>
  );
}
/* c8 ignore stop */
