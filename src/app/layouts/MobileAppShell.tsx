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
      className="relative flex min-h-[100dvh] flex-col bg-[var(--surface-neumorphic-base)] text-[var(--color-text-primary)]"
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

      <footer className="border-t border-[var(--color-border-hairline)] bg-[var(--surface-neumorphic-floating)] px-4 py-4 text-xs text-[var(--color-text-secondary)]">
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
            <h3 className="text-sm font-semibold text-[var(--color-text-secondary)]">Navigation</h3>
            <ul className="mt-3 space-y-2">
              {NAV_ITEMS.map((item) => (
                <li key={`drawer-${item.path}`}>
                  <Link
                    to={item.path}
                    className={cn(
                      "group relative flex w-full items-center gap-3 rounded-2xl border border-transparent px-5 py-3 text-sm font-medium transition-all duration-150",
                      activePath === item.path
                        ? "border-[var(--color-border-subtle)] bg-[color-mix(in_srgb,var(--surface-neumorphic-floating)_85%,transparent)] text-[var(--color-text-primary)] shadow-[var(--shadow-depth-1)]"
                        : "text-[var(--color-text-secondary)] hover:border-[var(--color-border-subtle)] hover:bg-[color-mix(in_srgb,var(--surface-neumorphic-floating)_70%,transparent)]",
                    )}
                    onClick={() => setIsOverflowOpen(false)}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "h-6 w-1 rounded-full transition-colors",
                        activePath === item.path
                          ? "bg-[var(--color-brand-primary)]"
                          : "bg-transparent group-hover:bg-[color-mix(in_srgb,var(--color-brand-primary)_45%,transparent)]",
                      )}
                    />
                    <span className="flex-1">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-[var(--color-text-secondary)]">
              Sekundäre Seiten
            </h3>
            <div className="mt-3 grid gap-2">
              {[
                { label: "Impressum", path: "/impressum" },
                { label: "Datenschutz", path: "/datenschutz" },
              ].map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="block w-full rounded-2xl border border-[var(--color-border-hairline)] px-5 py-2.5 text-left text-sm text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-border-subtle)] hover:bg-[color-mix(in_srgb,var(--surface-neumorphic-floating)_65%,transparent)]"
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
