import { type ReactNode, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { BuildInfo } from "../../components/BuildInfo";
import { GlobalNav, NAV_ITEMS } from "../../components/layout/GlobalNav";
import { NetworkBanner } from "../../components/NetworkBanner";
import { PWADebugInfo } from "../../components/pwa/PWADebugInfo";
import { PWAInstallPrompt } from "../../components/pwa/PWAInstallPrompt";
import { DrawerSheet } from "../../components/ui/drawer-sheet";
import { cn } from "../../lib/utils";

interface MobileAppShellProps {
  children: ReactNode;
}

export function MobileAppShell({ children }: MobileAppShellProps) {
  const location = useLocation();
  return <MobileAppShellLayout location={location}>{children}</MobileAppShellLayout>;
}

interface MobileAppShellLayoutProps {
  children: ReactNode;
  location: ReturnType<typeof useLocation>;
}

function MobileAppShellLayout({ children, location }: MobileAppShellLayoutProps) {
  const [isOverflowOpen, setIsOverflowOpen] = useState(false);

  const activePath = useMemo(() => {
    return NAV_ITEMS.find((item) => location.pathname.startsWith(item.path))?.path ?? "/chat";
  }, [location.pathname]);

  return (
    <div
      className="relative flex min-h-[100dvh] flex-col bg-[var(--color-surface-canvas)] text-[var(--color-text-primary)]"
      style={{ minHeight: "calc(100dvh + var(--keyboard-offset, 0px))" }}
    >
      <GlobalNav onMenuClick={() => setIsOverflowOpen(true)} />

      <main
        id="main"
        key={location.pathname}
        className="min-h-0 flex flex-1 flex-col overflow-y-auto px-4 pb-[calc(2rem+env(safe-area-inset-bottom))] pt-4"
      >
        <div className="mx-auto flex w-full max-w-[var(--max-content-width,480px)] flex-1 flex-col">
          {children}
        </div>
      </main>

      <footer className="border-t border-[var(--color-border-hairline)] bg-[var(--color-surface-base)] px-4 py-4 text-xs text-[var(--color-text-secondary)]">
        <div className="mx-auto flex w-full max-w-[var(--max-content-width,480px)] flex-col gap-2 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <div className="flex flex-col gap-1 sm:flex-row sm:gap-3">
            <span>Mobile Studio Preview</span>
            <span className="hidden sm:inline" aria-hidden="true">
              ·
            </span>
            <a href="/datenschutz" className="text-[var(--color-text-link)] hover:underline">
              Datenschutz
            </a>
          </div>
          <BuildInfo className="text-[11px] sm:text-xs" />
        </div>
      </footer>

      <NetworkBanner />
      <PWAInstallPrompt />
      {process.env.NODE_ENV === "development" && <PWADebugInfo />}

      <DrawerSheet title="Mehr" isOpen={isOverflowOpen} onClose={() => setIsOverflowOpen(false)}>
        <div className="space-y-4">
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-text-tertiary)]">
              Navigation
            </h3>
            <ul className="mt-2 space-y-2">
              {NAV_ITEMS.map((item) => (
                <li key={`drawer-${item.path}`}>
                  <Link
                    to={item.path}
                    className={cn(
                      "block w-full rounded-[var(--radius-card-inner)] border px-4 py-3 text-left text-sm font-medium transition-colors",
                      activePath === item.path
                        ? "border-[var(--color-brand-primary)] bg-[var(--color-brand-subtle)] text-[var(--color-brand-strong)]"
                        : "border-[var(--color-border-hairline)] hover:border-[var(--color-border-subtle)]",
                    )}
                    onClick={() => setIsOverflowOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-text-tertiary)]">
              Sekundäre Seiten
            </h3>
            <div className="mt-2 grid gap-2">
              {[
                { label: "Impressum", path: "/impressum" },
                { label: "Datenschutz", path: "/datenschutz" },
              ].map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="block w-full rounded-[var(--radius-card-inner)] border border-[var(--color-border-hairline)] px-4 py-2 text-left text-sm hover:border-[var(--color-border-subtle)]"
                  onClick={() => setIsOverflowOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </section>
        </div>
      </DrawerSheet>
    </div>
  );
}
