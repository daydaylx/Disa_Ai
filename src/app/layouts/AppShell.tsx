import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";

import { BuildInfo } from "../../components/BuildInfo";
import { ScrollToVoid } from "../../components/layout/ScrollToVoid";
import TopMenuButton from "../../components/nav/TopMenuButton";
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
      {/* Background gradients - soft depth aura */}
      <div className="pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(150%_120%_at_12%_10%,rgba(var(--color-surface-base),0.18)_0%,transparent_65%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(130%_110%_at_88%_18%,rgba(var(--color-brand-strong-rgb),0.12)_0%,transparent_60%)]" />
      </div>

      <ScrollToVoid>
        <div className="relative z-10 flex min-h-dvh flex-col">
          <header className="border-border bg-surface-base/90 sticky top-0 z-20 border-b backdrop-blur-xl sm:hidden">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="text-lg font-semibold tracking-tight text-text-primary">
                Disa<span className="text-brand">AI</span>
              </div>
              <div className="flex items-center gap-2">
                <TopMenuButton />
              </div>
            </div>
          </header>

          <main
            id="main"
            key={location.pathname}
            className={cn(
              "animate-page-transition flex flex-1 flex-col",
              "mx-auto w-full max-w-[var(--max-content-width)] px-4 pb-[calc(4.5rem+env(safe-area-inset-bottom,0px))] pt-6", // Further reduced bottom padding for better accessibility while keeping enough space
              "sm:px-6 sm:pb-16 sm:pt-[calc(6rem+env(safe-area-inset-top,0px))] lg:px-8",
            )}
          >
            {children}
          </main>

          <footer className="border-t border-border-subtle bg-surface-base py-5 text-text-secondary">
            <div className="mx-auto flex w-full max-w-[var(--max-content-width)] flex-col items-center gap-2 px-4 text-center text-xs sm:flex-row sm:justify-between sm:text-left">
              <div className="flex flex-col items-center gap-1 sm:flex-row sm:gap-3">
                <span>Disa AI Beta · Tooling Preview</span>
                <span className="hidden sm:block">|</span>
                <a
                  href="/privacy-policy.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand hover:underline"
                >
                  Datenschutzerklärung
                </a>
              </div>
              <BuildInfo className="text-[11px] sm:text-xs" />
            </div>
          </footer>
        </div>
      </ScrollToVoid>

      <NetworkBanner />
      <PWAInstallPrompt />

      {/* TopMenuButton is now the primary navigation for mobile */}

      {process.env.NODE_ENV === "development" && <PWADebugInfo />}
    </div>
  );
}
