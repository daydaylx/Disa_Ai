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
  const [isOverflowOpen, setIsOverflowOpen] = useState(false);
  const isMobile = useIsMobile();

  const activePath = useMemo(
    () => NAV_ITEMS.find((item) => location.pathname.startsWith(item.path))?.path ?? "/chat",
    [location.pathname],
  );

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const handler = (event: Event) => {
      const { action } =
        (event as CustomEvent<{ action?: "open" | "close" | "toggle" }>).detail ?? {};

      setIsOverflowOpen((prev) => {
        switch (action) {
          case "open":
            return true;
          case "close":
            return false;
          case "toggle":
            return !prev;
          default:
            return prev;
        }
      });
    };

    window.addEventListener("disa:bottom-sheet", handler as EventListener);
    return () => window.removeEventListener("disa:bottom-sheet", handler as EventListener);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.dispatchEvent(
      new CustomEvent("disa:bottom-sheet-state", { detail: { open: isOverflowOpen } }),
    );
  }, [isOverflowOpen]);

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

      <Header />

      {isMobile ? (
        <div className="border-b border-line-subtle bg-surface-base px-4 py-3">
          <button
            onClick={() => setIsOverflowOpen(true)}
            className="flex items-center gap-2 text-text-primary"
          >
            <span className="text-xl" aria-hidden="true">
              
            </span>
            <span>Menü</span>
          </button>
        </div>
      ) : (
        <div className="fixed left-0 top-0 h-full w-64 border-r border-line-subtle bg-surface-base p-4">
          <div className="mb-6 text-lg font-bold text-text-primary">Disa AI</div>
          <nav className="space-y-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={`desktop-${item.path}`}
                to={item.path}
                className={cn(
                  "group relative flex w-full items-center gap-3 rounded-2xl border border-transparent px-5 py-3 text-sm font-medium transition-all duration-150",
                  activePath === item.path
                    ? "border-line bg-surface-muted/80 text-text-primary shadow-sm backdrop-blur-sm"
                    : "text-text-secondary hover:border-line hover:bg-surface-muted/70 backdrop-blur-sm",
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
                <span className="flex-1">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      )}

      <main
        id="main"
        role="main"
        key={location.pathname}
        className={cn(
          "min-h-0 flex flex-1 flex-col overflow-y-auto p-page-padding-y px-page-padding-x",
          !isMobile && "ml-64",
        )}
      >
        <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col lg:max-w-4xl">{children}</div>
      </main>

      {isMobile && (
        <>
          <footer className="border-t border-line-subtle bg-surface-base px-4 py-4 text-xs text-text-secondary">
            <div className="mx-auto flex w-full max-w-2xl flex-col gap-2 text-center lg:max-w-4xl sm:flex-row sm:items-center sm:justify-between sm:text-left">
              <div className="flex flex-col gap-1 sm:flex-row sm:gap-3">
                <span>Mobile Studio Preview</span>
                <span className="hidden sm:inline" aria-hidden="true">
                  ·
                </span>
                <a href="/datenschutz" className="text-accent hover:underline">
                  Datenschutz
                </a>
              </div>
              <BuildInfo className="text-[11px] sm:text-xs" />
            </div>
          </footer>

          <MobileBottomNav />

          <NetworkBanner />
          <PWAInstallPrompt />
          {process.env.NODE_ENV === "development" && <PWADebugInfo />}

          <DrawerSheet
            title="Mehr"
            isOpen={isOverflowOpen}
            onClose={() => setIsOverflowOpen(false)}
          >
            <div className="space-y-4">
              <section>
                <h3 className="text-sm font-semibold text-text-secondary">Navigation</h3>
                <ul className="mt-3 space-y-2">
                  {NAV_ITEMS.map((item) => (
                    <li key={`drawer-${item.path}`}>
                      <Link
                        to={item.path}
                        className={cn(
                          "group relative flex w-full items-center gap-3 rounded-2xl border border-transparent px-5 py-3 text-sm font-medium transition-all duration-150",
                          activePath === item.path
                            ? "border-line bg-surface-muted/80 text-text-primary shadow-sm backdrop-blur-sm"
                            : "text-text-secondary hover:border-line hover:bg-surface-muted/70 backdrop-blur-sm",
                        )}
                        onClick={() => setIsOverflowOpen(false)}
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
                        <span className="flex-1">{item.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h3 className="text-sm font-semibold text-text-secondary">Sekundäre Seiten</h3>
                <div className="mt-3 grid gap-2">
                  {[
                    { label: "Impressum", path: "/impressum" },
                    { label: "Datenschutz", path: "/datenschutz" },
                  ].map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className="block w-full rounded-2xl border border-line-subtle px-5 py-2.5 text-left text-sm text-text-secondary transition-colors hover:border-line hover:bg-surface-muted/60 backdrop-blur-sm"
                      onClick={() => setIsOverflowOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </section>
            </div>
          </DrawerSheet>
        </>
      )}
    </div>
  );
}
