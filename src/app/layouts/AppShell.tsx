import { Cpu, MessageSquare, Plus, Settings, Users } from "lucide-react";
import type { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { BuildInfo } from "../../components/BuildInfo";
import { NavigationSidepanel } from "../../components/navigation/NavigationSidepanel";
import { NetworkBanner } from "../../components/NetworkBanner";
import { PWADebugInfo } from "../../components/pwa/PWADebugInfo";
import { PWAInstallPrompt } from "../../components/pwa/PWAInstallPrompt";
import { Button } from "../../components/ui";
import { useResponsiveLayout } from "../../hooks/useResponsiveLayout";
import { cn } from "../../lib/utils";
import { BrandWordmark } from "../components/BrandWordmark";
import { SidepanelProvider } from "../state/SidepanelContext";
import { useStudio } from "../state/StudioContext";

const NAV_ITEMS = [
  { to: "/chat", label: "Chat", icon: MessageSquare },
  { to: "/models", label: "Modelle", icon: Cpu },
  { to: "/roles", label: "Rollen", icon: Users },
  { to: "/settings", label: "Einstellungen", icon: Settings },
];

// Navigation is now handled by NavigationSidepanel component

function TopBar() {
  const { activeRole } = useStudio();
  const location = useLocation();
  const navigate = useNavigate();

  const handleNewChat = () => {
    const timestamp = Date.now();
    void navigate("/chat", {
      state: { newChat: timestamp },
      replace: location.pathname === "/chat",
    });
  };

  const headerPadding = "1.25rem";

  return (
    <header
      className="glass glass--subtle sticky top-0 z-30 border-b border-border/80 backdrop-blur-md transition-all duration-200"
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
    >
      <div
        className="mx-auto flex h-16 w-full max-w-[var(--max-content-width)] items-center justify-between gap-6"
        style={{
          paddingLeft: `calc(${headerPadding} + env(safe-area-inset-left, 0px))`,
          paddingRight: `calc(${headerPadding} + env(safe-area-inset-right, 0px))`,
        }}
      >
        <div className="flex flex-1 items-center gap-5">
          <div className="flex items-center gap-3">
            <span className="brand-rail h-9 w-1 rounded-r-full" aria-hidden="true" />
            <BrandWordmark />
          </div>
        </div>
        <div className="flex min-w-0 flex-wrap items-center justify-end gap-3">
          <div className="hidden min-w-0 flex-col items-end gap-1 text-xs leading-tight text-text-1 sm:flex">
            {activeRole ? (
              <>
                <span className="brand-chip touch-target no-select max-w-full truncate">
                  {activeRole.category ?? "Rolle"}
                </span>
                <span className="line-clamp-1 text-[11px] text-text-1">{activeRole.name}</span>
              </>
            ) : (
              <span className="brand-chip touch-target no-select">Assistive Studio</span>
            )}
          </div>
          <Button
            variant="brand"
            size="sm"
            onClick={handleNewChat}
            aria-label="Neues Gespräch starten"
            className="haptic-feedback flex-shrink-0 px-4"
          >
            <Plus className="h-4 w-4" />
            <span>Neu</span>
          </Button>
        </div>
      </div>
    </header>
  );
}

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const location = useLocation();

  return (
    <SidepanelProvider>
      <AppShellLayout location={location}>{children}</AppShellLayout>
    </SidepanelProvider>
  );
}

interface AppShellLayoutProps {
  children: ReactNode;
  location: ReturnType<typeof useLocation>;
}

function AppShellLayout({ children, location }: AppShellLayoutProps) {
  const layout = useResponsiveLayout();

  return (
    <div className="relative min-h-dvh overflow-hidden bg-surface-0 text-text-0">
      {/* Background gradients - Optimized for smooth rendering and no banding */}
      <div className="pointer-events-none will-change-[opacity]" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(140%_120%_at_0%_0%,rgba(111,211,255,0.22)_0%,rgba(111,211,255,0.12)_35%,rgba(111,211,255,0.05)_50%,transparent_58%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_100%_0%,rgba(255,159,111,0.18)_0%,rgba(255,159,111,0.10)_38%,rgba(255,159,111,0.04)_52%,transparent_62%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_120%,rgba(111,211,255,0.08)_0%,rgba(111,211,255,0.04)_45%,rgba(111,211,255,0.02)_60%,transparent_70%)]" />
      </div>

      {/* Main layout */}
      <div className="relative z-10 flex min-h-dvh flex-col">
        <TopBar />

        <div className="flex flex-1 overflow-hidden">
          {/* Main content */}
          <main
            id="main"
            key={location.pathname}
            className={cn(
              "animate-page-transition flex flex-1 flex-col overflow-y-auto",
              "mx-auto w-full max-w-[var(--max-content-width)] px-4 pb-10 pt-8 sm:px-6",
              // Adjust padding on larger screens if sidepanel is persistent
              layout.sidepanelMode === "persistent" ? "lg:pr-8" : "lg:px-8",
            )}
          >
            {children}
          </main>
        </div>

        {/* Footer */}
        <footer className="border-t border-border/80 bg-[rgba(var(--glass-bg),0.55)] py-6 backdrop-blur">
          <div className="mx-auto flex w-full max-w-[var(--max-content-width)] flex-col items-center gap-1 px-4 text-center text-xs text-text-1 sm:flex-row sm:justify-between sm:text-left">
            <span>Disa AI Beta · Tooling Preview</span>
            <BuildInfo className="text-[11px] text-text-1" />
          </div>
        </footer>
      </div>

      {/* Navigation Sidepanel */}
      <NavigationSidepanel
        items={NAV_ITEMS}
        className={cn(
          // Adjust position based on layout mode
          layout.sidepanelMode === "persistent" ? "hidden lg:block" : "",
        )}
      >
        {/* Optional sidepanel footer content */}
        <div className="space-y-2 text-xs text-text-1">
          <div>Version: 1.0.0</div>
          <div>Mode: {layout.sidepanelMode}</div>
        </div>
      </NavigationSidepanel>

      {/* Global components */}
      <NetworkBanner />
      <PWAInstallPrompt />
      {process.env.NODE_ENV === "development" && <PWADebugInfo />}
    </div>
  );
}
