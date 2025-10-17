import { Cpu, MessageSquare, Plus, Settings, Users } from "lucide-react";
import type { ReactNode } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

import { BuildInfo } from "../../components/BuildInfo";
import { NetworkBanner } from "../../components/NetworkBanner";
import { PWADebugInfo } from "../../components/pwa/PWADebugInfo";
import { PWAInstallPrompt } from "../../components/pwa/PWAInstallPrompt";
import { Button } from "../../components/ui";
import { cn } from "../../lib/utils";
import { useStudio } from "../state/StudioContext";

const NAV_ITEMS = [
  { to: "/chat", label: "Chat", icon: MessageSquare },
  { to: "/models", label: "Modelle", icon: Cpu },
  { to: "/roles", label: "Rollen", icon: Users },
  { to: "/settings", label: "Einstellungen", icon: Settings },
];

function BrandWordmark() {
  return (
    <span className="text-text-0 text-lg font-semibold tracking-tight">
      Disa<span className="text-brand">▮</span>AI
    </span>
  );
}

function DesktopNav() {
  return (
    <nav className="border-border/80 glass glass--subtle hidden items-center gap-1 rounded-full border px-1 py-1 shadow-level backdrop-blur-md lg:flex">
      {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            cn(
              "touch-target no-select flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition-all duration-200",
              isActive
                ? "text-brand border-border/60 border bg-[rgba(111,211,255,0.16)] shadow-neon"
                : "text-text-1 hover:text-text-0 hover:bg-hover-bg hover:-translate-y-[1px] hover:shadow-level",
            )
          }
        >
          <Icon className="h-4 w-4" aria-hidden />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

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

  return (
    <header className="border-border/80 glass glass--subtle sticky top-0 z-40 border-b backdrop-blur-md transition-all duration-200">
      <div className="mx-auto flex h-16 w-full max-w-[var(--max-content-width)] items-center justify-between gap-6 px-4 lg:px-6">
        <div className="flex flex-1 items-center gap-5">
          <div className="flex items-center gap-3">
            <span className="brand-rail h-9 w-1 rounded-r-full" aria-hidden="true" />
            <BrandWordmark />
          </div>
          <DesktopNav />
        </div>
        <div className="flex items-center gap-3">
          <div className="text-text-1 hidden flex-col items-end gap-1 text-xs leading-tight sm:flex">
            {activeRole ? (
              <>
                <span className="brand-chip touch-target no-select">
                  {activeRole.category ?? "Rolle"}
                </span>
                <span className="text-text-1 line-clamp-1 text-[11px]">{activeRole.name}</span>
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
            className="haptic-feedback px-4"
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
    <div className="bg-surface-0 text-text-0 relative min-h-dvh overflow-hidden">
      <div className="pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(140%_120%_at_0%_0%,rgba(111,211,255,0.22),transparent_58%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_100%_0%,rgba(255,159,111,0.18),transparent_62%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_120%,rgba(111,211,255,0.08),transparent_70%)]" />
        <div className="absolute inset-0 bg-[conic-gradient(from_180deg_at_50%_50%,rgba(255,255,255,0.04)_0deg,transparent_140deg,transparent_220deg,rgba(255,255,255,0.06)_360deg)] opacity-60 mix-blend-overlay" />
      </div>

      <div className="relative z-10 flex min-h-dvh flex-col">
        <TopBar />

        <main
          id="main"
          key={location.pathname}
          className="animate-page-transition mx-auto flex w-full max-w-[var(--max-content-width)] flex-1 flex-col px-4 pb-10 pt-8 sm:px-6 lg:px-8"
        >
          {children}
        </main>

        

        <footer className="border-border/80 border-t bg-[rgba(var(--glass-bg),0.55)] py-6 backdrop-blur">
          <div className="text-text-1 mx-auto flex w-full max-w-[var(--max-content-width)] flex-col items-center gap-1 px-4 text-center text-xs sm:flex-row sm:justify-between sm:text-left">
            <span>Disa AI Beta · Tooling Preview</span>
            <BuildInfo className="text-text-1 text-[11px]" />
          </div>
        </footer>
      </div>

      <NetworkBanner />
      <PWAInstallPrompt />
      {process.env.NODE_ENV === "development" && <PWADebugInfo />}
    </div>
  );
}
