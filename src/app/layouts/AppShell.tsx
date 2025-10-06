import { Bot, Compass, MessageSquare, PlusCircle, Settings, Users } from "lucide-react";
import type { ReactNode } from "react";
import { NavLink, useLocation } from "react-router-dom";

import { BuildInfo } from "../../components/BuildInfo";
import { NetworkBanner } from "../../components/NetworkBanner";
import { Button } from "../../components/ui";
import { useStudio } from "../state/StudioContext";

function Header() {
  const { activeRole } = useStudio();

  return (
    <header className="relative z-10 px-4 pb-6 pt-10">
      <div className="mx-auto max-w-md">
        <div className="glass-2 bg-white/7 relative rounded-2xl border border-white/20 p-6 shadow-[0_8px_30px_rgba(0,0,0,0.28)] backdrop-blur-md backdrop-saturate-150 before:pointer-events-none before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-b before:from-white/10 before:to-transparent before:content-['']">
          <div className="relative flex items-center justify-between">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium tracking-wide text-corporate-text-onSurface">
                  <Compass className="h-3.5 w-3.5" /> KI-Studio
                </div>
                {activeRole && (
                  <div className="border-accent-500/30 bg-accent-500/20 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium text-corporate-text-onAccent">
                    <Bot className="h-3.5 w-3.5" />
                    {activeRole.name}
                  </div>
                )}
              </div>
              <div>
                <h1
                  className="text-3xl font-semibold text-white drop-shadow-[0_4px_18px_rgba(147,51,234,0.45)]"
                  data-testid="app-title"
                >
                  Disa AI
                </h1>
                <p className="mt-1 text-sm text-white/70">
                  {activeRole
                    ? `${activeRole.category ?? "Rolle"} • ${activeRole.name}`
                    : "Texte, Bilder und Ideen in Sekunden, direkt im Chat."}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end gap-4">
              <Button
                size="sm"
                variant="ghost"
                aria-label="Neues Gespräch"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border-0 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400 px-5 font-medium tracking-wide text-white shadow-[0_6px_24px_rgba(32,0,72,0.45)] transition-transform hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-white/20 active:scale-[0.98]"
              >
                <PlusCircle className="h-4 w-4" /> Neu starten
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function BottomNav() {
  // TODO: Change to /roles when the route is available
  const navigationItems = [
    { to: "/chat", label: "Chat", icon: <MessageSquare /> },
    { to: "/models", label: "Rollen", icon: <Users /> },
    { to: "/settings", label: "Einstellungen", icon: <Settings /> },
  ];

  return (
    <nav className="sticky bottom-0 z-20 border-t border-white/10 bg-white/5 backdrop-blur-lg">
      <div
        className="mx-auto flex h-16 max-w-md items-center justify-around"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        {navigationItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            title={item.label}
            className={({ isActive }) =>
              `relative flex min-h-touch-rec min-w-touch-rec touch-manipulation flex-col items-center justify-center gap-1 rounded-xl p-2 text-xs font-medium transition-colors duration-150 ease-out ${
                isActive
                  ? "bg-white/8 border-white/12 rounded-xl border font-medium text-white"
                  : "text-white/65 hover:text-white/85"
              }`
            }
          >
            <span className="flex h-6 w-6 items-center justify-center">{item.icon}</span>
            <span className="text-[10px] leading-none">{item.label}</span>
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
    <div
      className="stage relative flex w-full flex-col overflow-hidden text-slate-200"
      style={{
        minHeight: "var(--vh, 100dvh)",
        height: "var(--vh, 100dvh)",
        maxHeight: "var(--vh, 100dvh)",
        background:
          "radial-gradient(1200px 700px at 20% -10%, #121327 0%, #0B0820 60%, #080714 100%)",
      }}
    >
      {/* Noise overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='128' height='128'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.02'/></svg>")`,
        }}
      />

      <Header />

      <main
        key={location.pathname}
        className="animate-page-transition relative z-10 mx-auto w-full max-w-md flex-1 overflow-y-auto overflow-x-hidden px-4 pb-20"
      >
        {children}
      </main>

      <NetworkBanner />
      <BottomNav />

      {/* Footer mit Build-Info für Issue #81 */}
      <footer
        className="relative z-10 px-4 pb-2"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 0.5rem)" }}
      >
        <div className="mx-auto max-w-xs text-center">
          <BuildInfo className="opacity-60 transition-opacity hover:opacity-100" />
        </div>
      </footer>
    </div>
  );
}
