import { Bot, Compass, Cpu, MessageSquare, PlusCircle, Settings, Users } from "lucide-react";
import type { ReactNode } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

import { BuildInfo } from "../../components/BuildInfo";
import { NetworkBanner } from "../../components/NetworkBanner";
import { Button } from "../../components/ui";
import { cn } from "../../lib/utils";
import { useStudio } from "../state/StudioContext";

function Header() {
  const { activeRole } = useStudio();
  const location = useLocation();
  const navigate = useNavigate();

  const handleNewChatClick = () => {
    const timestamp = Date.now();
    void navigate("/chat", {
      state: { newChat: timestamp },
      replace: location.pathname === "/chat",
    });
  };

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
                  className="text-3xl font-semibold text-zinc-100 drop-shadow-[0_4px_18px_rgba(147,51,234,0.35)]"
                  data-testid="app-title"
                >
                  Disa AI
                </h1>
                <p className="mt-1 text-sm text-zinc-400">
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
                onClick={handleNewChatClick}
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
  const navigationItems = [
    { to: "/chat", label: "Chat", icon: <MessageSquare /> },
    { to: "/models", label: "Modelle", icon: <Cpu /> },
    { to: "/roles", label: "Rollen", icon: <Users /> },
    { to: "/settings", label: "Einstellungen", icon: <Settings /> },
  ];

  return (
    <nav className="sticky bottom-0 z-20 border-t border-white/10 bg-[#040513]/90 backdrop-blur-2xl">
      <div
        className="mx-auto w-full max-w-md px-4"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <div className="glass-strong flex items-center justify-between gap-2 rounded-2xl px-2 py-2 shadow-[0_18px_40px_rgba(5,8,18,0.45)]">
          {navigationItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              title={item.label}
              className={({ isActive }) =>
                cn(
                  "group relative flex min-h-touch-rec min-w-[94px] touch-manipulation flex-col items-center justify-center gap-1 rounded-xl px-3 py-2 text-xs font-medium transition-colors duration-150 ease-out",
                  isActive ? "text-zinc-100" : "text-zinc-400 hover:text-zinc-200",
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    aria-hidden="true"
                    className={cn(
                      "via-accent-500/80 pointer-events-none absolute inset-x-2 top-1 h-0.5 rounded-full bg-gradient-to-r from-transparent to-transparent transition-opacity duration-200",
                      isActive ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <span
                    className={cn(
                      "flex h-6 w-6 items-center justify-center rounded-lg transition-colors",
                      isActive
                        ? "bg-white/12 text-zinc-100"
                        : "bg-white/8 group-hover:bg-white/12 text-zinc-400 group-hover:text-zinc-100",
                    )}
                  >
                    {item.icon}
                  </span>
                  <span className="text-[10px] leading-none tracking-[0.08em]">{item.label}</span>
                  <span
                    aria-hidden="true"
                    className={cn(
                      "bg-accent-500/70 pointer-events-none absolute inset-x-6 bottom-1 h-1 rounded-full blur-[2px] transition-opacity duration-200",
                      isActive ? "opacity-90" : "opacity-0",
                    )}
                  />
                </>
              )}
            </NavLink>
          ))}
        </div>
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
      className="stage relative flex w-full flex-col text-slate-200"
      style={{
        minHeight: "100vh",
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
        className="animate-page-transition relative z-10 mx-auto w-full max-w-md px-4 py-4"
      >
        {children}
      </main>

      <BottomNav />

      <NetworkBanner />

      {/* Footer mit Build-Info für Issue #81 */}
      <footer
        className="relative z-10 px-4 pb-2"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 0.5rem)" }}
      >
        <div className="mx-auto w-full max-w-md">
          <div className="glass-strong rounded-2xl px-5 py-4 text-center shadow-[0_16px_48px_rgba(5,8,18,0.35)]">
            <p className="text-[13px] font-medium text-zinc-100">
              Disa AI Beta • Experimentelle Oberfläche
            </p>
            <p className="mt-1 text-[12px] text-zinc-400">
              Feedback hilft uns, die Experience kontinuierlich zu verfeinern.
            </p>
            <BuildInfo className="mt-3 inline-flex items-center justify-center gap-1 rounded-full bg-white/10 px-3 py-1 font-mono text-[11px] text-zinc-300 transition-opacity hover:opacity-100" />
          </div>
        </div>
      </footer>
    </div>
  );
}
