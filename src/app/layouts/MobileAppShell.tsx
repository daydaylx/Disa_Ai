import { type ReactNode, useState } from "react";
import { useLocation } from "react-router-dom";

import { BuildInfo } from "../../components/BuildInfo";
import { BurgerMenu } from "../../components/layout/BurgerMenu";
import { MobileBottomNavigation } from "../../components/layout/MobileBottomNavigation";
import { MobileHeader } from "../../components/layout/MobileHeader";
import { ScrollToVoid } from "../../components/layout/ScrollToVoid";
import { NetworkBanner } from "../../components/NetworkBanner";
import { PWADebugInfo } from "../../components/pwa/PWADebugInfo";
import { PWAInstallPrompt } from "../../components/pwa/PWAInstallPrompt";
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="app-shell text-text-0 relative min-h-screen min-h-dvh overflow-x-hidden bg-[var(--surface-bg)]">
      {/* Background gradients - soft depth aura */}
      <div className="pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(150%_120%_at_12%_10%,rgba(var(--color-surface-base),0.18)_0%,transparent_65%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(130%_110%_at_88%_18%,rgba(var(--color-brand-strong-rgb),0.12)_0%,transparent_60%)]" />
      </div>

      <ScrollToVoid>
        <div className="relative z-10 flex min-h-screen min-h-dvh flex-col">
          <MobileHeader onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} isMenuOpen={isMenuOpen} />

          <main
            id="main"
            key={location.pathname}
            className={cn(
              "main-content animate-page-transition flex flex-1 flex-col",
              "mx-auto w-full max-w-[var(--max-content-width)] px-4 pt-20", // Adjusted padding for fixed bars
              "pb-[calc(6rem+env(safe-area-inset-bottom,0px))]", // Bottom nav + safe area
              "sm:px-6 sm:pb-16 sm:pt-24 lg:px-8",
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

      <BurgerMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <NetworkBanner />
      <PWAInstallPrompt />
      <MobileBottomNavigation />

      {process.env.NODE_ENV === "development" && <PWADebugInfo />}
    </div>
  );
}
