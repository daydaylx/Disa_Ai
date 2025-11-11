import { type ReactNode, useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { BuildInfo } from "../../components/BuildInfo";
import { Header } from "../../components/layout/Header";
import { MobileBottomNav } from "../../components/layout/MobileBottomNav";
import { NetworkBanner } from "../../components/NetworkBanner";
import { PWADebugInfo } from "../../components/pwa/PWADebugInfo";
import { PWAInstallPrompt } from "../../components/pwa/PWAInstallPrompt";
import { DrawerSheet } from "../../components/ui/drawer-sheet";
import { useIsMobile } from "../../hooks/useMediaQuery";
import { cn } from "../../lib/utils";

interface AppShellProps {
  children: ReactNode;
}

const NAV_ITEMS = [
  { path: "/", label: "Studio" },
  { path: "/chat", label: "Chat" },
  { path: "/models", label: "Modelle" },
  { path: "/roles", label: "Rollen" },
  { path: "/settings", label: "Einstellungen" },
];

interface AppShellLayoutProps {
  children: ReactNode;
  location: ReturnType<typeof useLocation>;
}

export function AppShell({ children }: AppShellProps) {
  const location = useLocation();
  return <AppShellLayout location={location}>{children}</AppShellLayout>;
}

function AppShellLayout({ children, location }: AppShellLayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const activePath = useMemo(
    () =>
      NAV_ITEMS.find((item) =>
        item.path === "/" ? location.pathname === "/" : location.pathname.startsWith(item.path),
      )?.path ?? "/",
    [location.pathname],
  );

  useEffect(() => {
    if (!isMenuOpen) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isMenuOpen]);

  return (
    <div
      className="relative flex min-h-[100dvh] flex-col bg-surface-bg text-text-primary"
      style={{ minHeight: "calc(100dvh + var(--keyboard-offset, 0px))" }}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-skip-link focus:rounded focus:bg-accent focus:px-3 focus:py-2 focus:text-white focus:font-medium focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-accent"
      >
        Zum Hauptinhalt springen
      </a>

      <Header onMenuClick={() => setIsMenuOpen(true)} />

      <div className="flex flex-1">
        {!isMobile && (
          <aside className="sticky top-14 hidden h-[calc(100dvh-3.5rem)] w-56 flex-shrink-0 flex-col border-r border-line-subtle bg-surface-base/98 px-3 py-4 lg:flex">
            <div className="mb-4 text-[10px] font-semibold uppercase tracking-[0.28em] text-text-secondary">
              Navigation
            </div>
            <nav className="space-y-1 text-sm">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "group flex items-center gap-2 rounded-2xl px-3 py-2.5 transition-colors",
                    activePath === item.path
                      ? "bg-surface-muted/90 text-text-primary shadow-neo-xs"
                      : "text-text-secondary hover:bg-surface-muted/70 hover:text-text-primary",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "h-6 w-1 rounded-full transition-colors",
                      activePath === item.path
                        ? "bg-accent"
                        : "bg-transparent group-hover:bg-accent/40",
                    )}
                  />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
            <div className="mt-auto pt-4 text-[10px] text-text-tertiary">
              <BuildInfo />
            </div>
          </aside>
        )}

        <main
          id="main"
          role="main"
          key={location.pathname}
          className={cn(
            "min-h-0 flex flex-1 flex-col overflow-y-auto p-page-padding-y px-page-padding-x",
            !isMobile && "ml-0",
          )}
        >
          <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col">{children}</div>
        </main>
      </div>

      {isMobile && (
        <>
          <MobileBottomNav />

          <NetworkBanner />
          <PWAInstallPrompt />
          {process.env.NODE_ENV === "development" && <PWADebugInfo />}

          <DrawerSheet
            title="Disa AI Studio"
            isOpen={isMenuOpen}
            onClose={() => setIsMenuOpen(false)}
          >
            <nav className="space-y-2">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={`drawer-${item.path}`}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    "flex items-center justify-between rounded-2xl px-4 py-3 text-sm transition-colors",
                    activePath === item.path
                      ? "bg-surface-muted/90 text-text-primary shadow-neo-xs"
                      : "text-text-secondary hover:bg-surface-muted/70 hover:text-text-primary",
                  )}
                >
                  <span>{item.label}</span>
                  {activePath === item.path && (
                    <span className="text-[10px] text-accent">aktiv</span>
                  )}
                </Link>
              ))}
            </nav>

            <div className="mt-6 space-y-2 text-[11px] text-text-secondary">
              <Link
                to="/impressum"
                onClick={() => setIsMenuOpen(false)}
                className="block rounded-xl px-3 py-2 hover:bg-surface-muted/70"
              >
                Impressum
              </Link>
              <Link
                to="/datenschutz"
                onClick={() => setIsMenuOpen(false)}
                className="block rounded-xl px-3 py-2 hover:bg-surface-muted/70"
              >
                Datenschutz
              </Link>
            </div>
          </DrawerSheet>
        </>
      )}
    </div>
  );
}
