import { Bot, Compass, MessageSquare, PlusCircle, Settings, Users } from "lucide-react";
import { ReactNode } from "react";
import { NavLink, useLocation } from "react-router-dom";

import { BuildInfo } from "../../components/BuildInfo";
import { NetworkBanner } from "../../components/NetworkBanner";
import { Button } from "../../components/ui";
import { useStudio } from "../state/StudioContext";

function Header() {
  const { activeRole } = useStudio();

  return (
    <header className="relative z-10 px-4 pb-4 pt-10">
      <div className="mx-auto max-w-md">
        <div className="relative rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-lg">
          <div className="relative flex items-center justify-between">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium tracking-wide text-white/80">
                  <Compass className="h-3.5 w-3.5" /> KI-Studio
                </div>
                {activeRole && (
                  <div className="border-accent-500/30 bg-accent-500/20 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium text-white/90">
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
                    : "Deine kreative Copilotin für Texte, Bilder und Inspiration."}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end gap-3">
              <Button
                size="sm"
                variant="ghost"
                aria-label="Neues Gespräch"
                className="inline-flex items-center gap-2 rounded-full border-0 bg-gradient-to-r from-fuchsia-500 via-purple-500 to-sky-500 px-4 py-2 text-sm font-medium text-white shadow-[0_18px_38px_rgba(168,85,247,0.4)] transition-transform hover:translate-y-[-1px] hover:bg-transparent hover:shadow-[0_20px_45px_rgba(168,85,247,0.55)]"
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
    <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-white/10 bg-slate-950/80 backdrop-blur-lg">
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
              `relative flex h-12 w-16 flex-col items-center justify-center gap-1 rounded-lg text-xs font-medium transition-colors duration-200 ${
                isActive
                  ? "bg-white/10 text-purple-400"
                  : "text-neutral-400 hover:bg-white/5 hover:text-white"
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
      className="relative flex w-full flex-col overflow-hidden bg-gradient-to-br from-slate-950 via-[#160037] to-[#060112] text-slate-200"
      style={{
        minHeight: "var(--vh, 100dvh)",
        height: "var(--vh, 100dvh)",
        maxHeight: "var(--vh, 100dvh)",
      }}
    >
      <div className="pointer-events-none absolute inset-x-0 top-[-30%] h-[60%] bg-[radial-gradient(circle_at_top,_rgba(236,72,153,0.35),_transparent_65%)]" />
      <div className="pointer-events-none absolute inset-x-[-20%] bottom-[-35%] h-[55%] bg-[radial-gradient(circle_at_bottom,_rgba(59,130,246,0.25),_transparent_70%)]" />

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
