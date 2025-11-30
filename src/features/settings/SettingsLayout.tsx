import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { cn } from "@/lib/utils";
import { Button } from "@/ui/Button";

import {
  BookOpenCheck,
  Cat,
  Database,
  MessageSquare,
  Settings as SettingsIcon,
  Shield,
  SlidersHorizontal,
} from "../../lib/icons";

interface SettingsLayoutProps {
  children: React.ReactNode;
  activeTab?: "overview" | "memory" | "behavior" | "youth" | "extras" | "api-data";
  title?: string;
  description?: string;
}

const NAV_ITEMS = [
  {
    id: "memory",
    label: "Gedächtnis",
    icon: BookOpenCheck,
    to: "/settings/memory",
    hint: "Verlauf & Profil",
  },
  {
    id: "behavior",
    label: "KI Verhalten",
    icon: SlidersHorizontal,
    to: "/settings/behavior",
    hint: "Kreativität & Stil",
  },
  {
    id: "youth",
    label: "Jugendschutz",
    icon: Shield,
    to: "/settings/youth",
    hint: "Filter & Sicherheit",
  },
  { id: "extras", label: "Experimente", icon: Cat, to: "/settings/extras", hint: "Neko & Labs" },
  {
    id: "api-data",
    label: "API & Daten",
    icon: Database,
    to: "/settings/api-data",
    hint: "Schlüssel & Export",
  },
] as const;

export function SettingsLayout({ children, activeTab, title, description }: SettingsLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const derivedActive = React.useMemo(() => {
    if (activeTab) return activeTab;
    const match = NAV_ITEMS.find((item) => location.pathname.startsWith(item.to));
    return match?.id;
  }, [activeTab, location.pathname]);

  return (
    <div className="flex min-h-[70vh] flex-col gap-4 text-text-primary">
      <div className="border-b border-border-ink/10 bg-bg-page/90 px-4 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-tertiary">
              Einstellungen
            </p>
            <h1 className="text-2xl font-bold text-ink-primary">
              {title ?? "Deine Steuerzentrale"}
            </h1>
            <p className="text-sm text-ink-secondary">
              {description ??
                "Passe Verhalten, Sicherheit und Darstellung an – mobil und Desktop einheitlich."}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="self-start rounded-full"
            onClick={() => navigate("/chat")}
          >
            Zurück zum Chat
          </Button>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 pb-6 lg:flex-row">
        <nav className="rounded-2xl border border-border-ink/20 bg-surface-1 p-3 shadow-sm lg:w-64">
          <div className="mb-2 flex items-center gap-2 px-2 text-xs font-semibold uppercase tracking-wide text-ink-tertiary">
            <SettingsIcon className="h-4 w-4" /> Navigation
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = derivedActive === item.id;
              return (
                <Link
                  key={item.id}
                  to={item.to}
                  className={cn(
                    "group flex min-h-[48px] flex-1 items-center gap-3 rounded-xl border px-3 py-3 text-sm font-medium transition",
                    isActive
                      ? "border-accent-primary/60 bg-accent-primary/10 text-ink-primary shadow-[0_10px_30px_-18px_rgba(109,140,255,0.8)]"
                      : "border-border-ink/15 bg-surface-2 text-ink-secondary hover:border-accent-primary/40 hover:bg-surface-1",
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  <span
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-lg border",
                      isActive
                        ? "border-accent-primary/40 bg-accent-primary/15 text-accent-primary"
                        : "border-border-ink/30 bg-surface-1 text-ink-secondary",
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">{item.label}</div>
                    <div className="truncate text-xs text-ink-tertiary">{item.hint}</div>
                  </div>
                </Link>
              );
            })}
            <Link
              to="/feedback"
              className="group flex min-h-[48px] flex-1 items-center gap-3 rounded-xl border border-border-ink/15 bg-surface-2 px-3 py-3 text-sm font-medium text-ink-secondary transition hover:border-accent-primary/40 hover:bg-surface-1"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-border-ink/30 bg-surface-1 text-ink-secondary">
                <MessageSquare className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold">Feedback</div>
                <div className="truncate text-xs text-ink-tertiary">
                  Fehler melden & Wünsche teilen
                </div>
              </div>
            </Link>
          </div>
        </nav>

        <main className="flex-1">
          <div className="rounded-2xl border border-border-ink/20 bg-surface-1 p-4 shadow-sm sm:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
