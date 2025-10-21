import { Cpu, Menu, MessageSquare, Plus, Settings, Users } from "lucide-react";
import type { ReactNode } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

import { BuildInfo } from "../../components/BuildInfo";
import { NetworkBanner } from "../../components/NetworkBanner";
import { PWADebugInfo } from "../../components/pwa/PWADebugInfo";
import { PWAInstallPrompt } from "../../components/pwa/PWAInstallPrompt";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui";
import { cn } from "../../lib/utils";
import { BrandWordmark } from "../components/BrandWordmark";
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

  const headerPadding = "1rem";

  return (
    <header
      className="bg-surface-0/80 supports-[backdrop-filter]:bg-surface-0/70 sticky top-0 z-30 border-b border-border/60 backdrop-blur-md transition-all duration-200"
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
    >
      <div
        className="mx-auto flex h-14 w-full max-w-[var(--max-content-width)] items-center justify-between gap-4"
        style={{
          paddingLeft: `calc(${headerPadding} + env(safe-area-inset-left, 0px))`,
          paddingRight: `calc(${headerPadding} + env(safe-area-inset-right, 0px))`,
        }}
      >
        <div className="flex flex-1 items-center gap-3">
          <div className="flex items-center gap-3">
            <span className="brand-rail h-9 w-1 rounded-r-full" aria-hidden="true" />
            <BrandWordmark />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="ml-auto h-9 w-9 rounded-full border border-border/40 md:hidden"
                aria-label="Navigation öffnen"
              >
                <Menu className="h-4 w-4" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={8} className="w-48 space-y-1">
              {NAV_ITEMS.map((item) => (
                <DropdownMenuItem
                  key={item.to}
                  onSelect={(event) => {
                    event.preventDefault();
                    void navigate(item.to);
                  }}
                  className={cn(
                    "flex items-center gap-2",
                    location.pathname.startsWith(item.to) ? "text-text-strong" : "text-text-muted",
                  )}
                >
                  <item.icon className="h-4 w-4" aria-hidden="true" />
                  <span>{item.label}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <nav
            aria-label="Hauptnavigation"
            className="hidden items-center gap-1 text-sm font-medium text-text-2 md:flex"
          >
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-2 rounded-full px-3 py-2 transition-colors duration-150",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-0",
                    isActive
                      ? "bg-brand/15 text-text-strong"
                      : "hover:bg-surface-1/70 text-text-2 hover:text-text-strong",
                  )
                }
              >
                <item.icon className="h-4 w-4 flex-shrink-0 opacity-80" aria-hidden="true" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
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

  return <AppShellLayout location={location}>{children}</AppShellLayout>;
}

interface AppShellLayoutProps {
  children: ReactNode;
  location: ReturnType<typeof useLocation>;
}

function AppShellLayout({ children, location }: AppShellLayoutProps) {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-surface-0 text-text-0">
      {/* Background gradients - Optimized for smooth rendering and no banding */}
      <div className="pointer-events-none will-change-[opacity]" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(160%_140%_at_10%_12%,rgba(var(--glass-tint-neutral-rgb),0.16)_0%,transparent_65%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(140%_120%_at_90%_18%,rgba(var(--acc2-rgb),0.08)_0%,transparent_60%)]" />
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
              "mx-auto w-full max-w-[var(--max-content-width)] px-4 pb-8 pt-6 sm:px-6 lg:px-8",
            )}
          >
            {children}
          </main>
        </div>

        {/* Footer */}
        <footer className="bg-surface-0/70 supports-[backdrop-filter]:bg-surface-0/60 border-t border-border/50 py-5 backdrop-blur-md">
          <div className="mx-auto flex w-full max-w-[var(--max-content-width)] flex-col items-center gap-1 px-4 text-center text-xs text-text-1 sm:flex-row sm:justify-between sm:text-left">
            <span>Disa AI Beta · Tooling Preview</span>
            <BuildInfo className="text-[11px] text-text-1" />
          </div>
        </footer>
      </div>

      {/* Global components */}
      <NetworkBanner />
      <PWAInstallPrompt />
      {process.env.NODE_ENV === "development" && <PWADebugInfo />}
    </div>
  );
}
