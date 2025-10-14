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
    <span className="text-lg font-semibold tracking-tight text-text-0">
      Disa<span className="text-brand">▮</span>AI
    </span>
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
    <header className="sticky top-0 z-40 h-14 border-b border-border bg-surface-0">
      <div className="mx-auto flex h-full w-full max-w-[var(--max-content-width)] items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-3">
          <span className="brand-rail h-full w-1" aria-hidden="true" />
          <div className="flex flex-col gap-1 leading-tight">
            <BrandWordmark />
            {activeRole ? (
              <div className="flex items-center gap-2">
                <span className="brand-chip">{activeRole.category ?? "Rolle"}</span>
                <span className="line-clamp-1 text-xs text-text-1">{activeRole.name}</span>
              </div>
            ) : (
              <span className="brand-chip">Assistive Studio</span>
            )}
          </div>
        </div>
        <Button
          variant="brand"
          size="sm"
          onClick={handleNewChat}
          aria-label="Neues Gespräch starten"
          className="px-4"
        >
          <Plus className="h-4 w-4" />
          <span>Neu</span>
        </Button>
      </div>
    </header>
  );
}

function BottomBar() {
  return (
    <nav className="sticky bottom-0 z-30 border-t border-border bg-surface-0">
      <div
        className="mx-auto flex h-16 w-full max-w-[var(--max-content-width)] items-center gap-1 px-2"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex flex-1 flex-col items-center justify-center gap-1 rounded-base px-2 py-2 text-[11px] font-medium uppercase tracking-[0.08em] transition-colors",
                isActive ? "brand-label-active" : "text-text-1 hover:text-text-0",
              )
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-base border border-transparent text-text-1 transition-colors",
                    isActive && "brand-icon-active",
                  )}
                  aria-hidden
                >
                  <Icon className="h-4 w-4" />
                </span>
                <span>{label}</span>
                <span
                  className={cn(
                    "h-[2px] w-6 rounded-full bg-brand transition-transform duration-200",
                    isActive ? "scale-100" : "scale-0",
                  )}
                  aria-hidden
                />
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const location = useLocation();

  return (
    <div className="flex min-h-dvh flex-col bg-surface-0 text-text-0">
      <TopBar />

      <main
        id="main"
        key={location.pathname}
        className="animate-page-transition mx-auto flex w-full max-w-[var(--max-content-width)] flex-1 flex-col px-4 py-6"
      >
        {children}
      </main>

      <BottomBar />

      <footer className="border-t border-border bg-surface-0 py-4">
        <div className="mx-auto flex w-full max-w-[var(--max-content-width)] flex-col items-center gap-1 px-4 text-center text-xs text-text-1">
          <span>Disa AI Beta · Tooling Preview</span>
          <BuildInfo className="text-[11px] text-text-1" />
        </div>
      </footer>

      <NetworkBanner />
      <PWAInstallPrompt />
      {process.env.NODE_ENV === "development" && <PWADebugInfo />}
    </div>
  );
}
