import { Compass, Cpu, MessageSquare, PlusCircle, Settings } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";

import { Button } from "../../components/ui";

interface NavigationItem {
  to: string;
  label: string;
  icon: React.ReactNode;
}

const navigationItems: NavigationItem[] = [
  {
    to: "/chat",
    label: "Chat",
    icon: <MessageSquare className="h-5 w-5" />,
  },
  {
    to: "/models",
    label: "Modelle",
    icon: <Cpu className="h-5 w-5" />,
  },
  {
    to: "/settings",
    label: "Einstellungen",
    icon: <Settings className="h-5 w-5" />,
  },
];

function Header() {
  return (
    <header className="relative z-10 px-5 pb-6 pt-12">
      <div className="mx-auto max-w-md">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_45px_90px_rgba(134,68,255,0.22)] backdrop-blur-2xl">
          <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.4),_transparent_60%)]" />
          <div className="pointer-events-none absolute -bottom-20 left-16 h-48 w-48 bg-[radial-gradient(circle_at_bottom,_rgba(56,189,248,0.65),_transparent_70%)]" />

          <div className="relative flex items-center justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium tracking-wide text-white/80">
                <Compass className="h-3.5 w-3.5" /> Entdecke dein persönliches KI-Studio
              </div>
              <div>
                <h1 className="text-3xl font-semibold text-white drop-shadow-[0_4px_18px_rgba(147,51,234,0.45)]">
                  Disa AI
                </h1>
                <p className="mt-1 text-sm text-white/70">
                  Deine kreative Copilotin für Texte, Bilder und Inspiration.
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/30 px-3 py-1 text-xs text-white/70">
                <Cpu className="h-3.5 w-3.5 text-sky-300" /> Aktives Modell
              </div>
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

function BottomTabs() {
  return (
    <nav
      className="relative z-10 mx-auto mb-[env(safe-area-inset-bottom)] mt-6 w-full max-w-xs overflow-hidden rounded-3xl border border-white/10 bg-white/5 px-2 py-3 text-[13px] text-white/70 shadow-[0_25px_65px_rgba(15,23,42,0.55)] backdrop-blur-xl"
      aria-label="Navigation"
    >
      <div className="grid grid-cols-3 gap-2">
        {navigationItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 rounded-2xl px-3 py-2 transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-fuchsia-500/70 via-purple-500/70 to-sky-500/70 text-white shadow-[0_12px_30px_rgba(168,85,247,0.35)]"
                  : "hover:bg-white/10 hover:text-white/90"
              }`
            }
          >
            <span className="h-5 w-5">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

export function AppShell() {
  return (
    <div className="relative mx-auto flex h-dvh w-full max-w-md flex-col overflow-hidden bg-gradient-to-br from-slate-950 via-[#160037] to-[#060112] text-slate-200">
      <div className="pointer-events-none absolute inset-x-0 top-[-30%] h-[60%] bg-[radial-gradient(circle_at_top,_rgba(236,72,153,0.35),_transparent_65%)]" />
      <div className="pointer-events-none absolute inset-x-[-20%] bottom-[-35%] h-[55%] bg-[radial-gradient(circle_at_bottom,_rgba(59,130,246,0.25),_transparent_70%)]" />

      <Header />

      <main className="relative z-10 flex-1 overflow-hidden px-4">
        <Outlet />
      </main>

      <BottomTabs />
    </div>
  );
}
