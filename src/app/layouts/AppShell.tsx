import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";

import { BuildInfo } from "../../components/BuildInfo";
import { Menu } from "../../components/layout/Menu";
import { NetworkBanner } from "../../components/NetworkBanner";
import { PWADebugInfo } from "../../components/pwa/PWADebugInfo";
import { PWAInstallPrompt } from "../../components/pwa/PWAInstallPrompt";
import { cn } from "../../lib/utils";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const location = useLocation();
  return <AppShellLayout location={location}>{children}</AppShellLayout>;
}

interface AppShellLayoutProps {
  children: ReactNode;
  location: ReturnType<typeof useLocation>;
}

function AppShellLayout({ children, location }: AppShellLayoutProps) {
  return (
    <div className="text-text-0 relative min-h-dvh overflow-hidden bg-[var(--surface-bg)]">
      {/* Background gradients - soft glass aura */}
      <div className="pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(150%_120%_at_12%_10%,rgba(var(--glass-tint-neutral-rgb),0.18)_0%,transparent_65%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(130%_110%_at_88%_18%,rgba(var(--acc2-rgb),0.12)_0%,transparent_60%)]" />
      </div>

      <Menu />

      <div className="relative z-10 flex min-h-dvh flex-col">
        <main
          id="main"
          key={location.pathname}
          className={cn(
            "animate-page-transition flex flex-1 flex-col overflow-y-auto",
            "mx-auto w-full max-w-[var(--max-content-width)] px-4 pb-[calc(7rem+env(safe-area-inset-bottom,0px))] pt-6",
            "sm:px-6 sm:pb-16 sm:pt-[calc(6rem+env(safe-area-inset-top,0px))] lg:px-8",
          )}
        >
          {children}
        </main>

        <footer className="border-t border-border-subtle bg-surface-base py-5 text-text-secondary">
          <div className="mx-auto flex w-full max-w-[var(--max-content-width)] flex-col items-center gap-1 px-4 text-center text-xs sm:flex-row sm:justify-between sm:text-left">
            <span>Disa AI Beta · Tooling Preview</span>
            <BuildInfo className="text-[11px]" />
          </div>
        </footer>
      </div>

      <NetworkBanner />
      <PWAInstallPrompt />
      {process.env.NODE_ENV === "development" && <PWADebugInfo />}
    </div>
  );
}
