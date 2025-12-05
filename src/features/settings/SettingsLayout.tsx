import React from "react";
import { Link, useLocation } from "react-router-dom";

import { cn } from "@/lib/utils";

import { AppMenuDrawer, useMenuDrawer } from "../../components/layout/AppMenuDrawer";
import { AppShell } from "../../components/layout/AppShell";
import {
  BookOpenCheck,
  Cat,
  Database,
  MessageSquare,
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
  {
    id: "feedback",
    label: "Feedback",
    icon: MessageSquare,
    to: "/feedback",
    hint: "Fehler melden & Wünsche teilen",
  },
] as const;

export function SettingsLayout({ children, activeTab, title, description }: SettingsLayoutProps) {
  const location = useLocation();
  const { isOpen, openMenu, closeMenu } = useMenuDrawer();

  const derivedActive = React.useMemo(() => {
    if (activeTab) return activeTab;
    const match = NAV_ITEMS.find((item) => location.pathname.startsWith(item.to));
    return match?.id;
  }, [activeTab, location.pathname]);

  return (
    <>
      <AppShell title="Einstellungen" onMenuClick={openMenu}>
        <div className="flex flex-col w-full h-full overflow-y-auto">
          {/* Header Content */}
          <div className="bg-surface-1/50 border-b border-white/5 px-4 py-6 backdrop-blur-sm">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-xl font-bold text-ink-primary">
                {title ?? "Deine Steuerzentrale"}
              </h1>
              <p className="text-sm text-ink-secondary mt-1">
                {description ?? "Passe Verhalten, Sicherheit und Darstellung an."}
              </p>
            </div>
          </div>

          <div className="flex-1 px-4 py-6 max-w-4xl mx-auto w-full">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Navigation Sidebar */}
              <nav className="lg:w-64 flex-shrink-0">
                <div className="flex gap-2 overflow-x-auto pb-4 lg:flex-col lg:pb-0 no-scrollbar">
                  {NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isActive = derivedActive === item.id;
                    return (
                      <Link
                        key={item.id}
                        to={item.to}
                        className={cn(
                          "group flex-shrink-0 flex items-center gap-3 px-4 py-3 rounded-xl border transition-all min-w-[160px] lg:min-w-0",
                          isActive
                            ? "bg-surface-2 border-accent-primary/30 text-ink-primary"
                            : "bg-surface-1 border-white/5 text-ink-secondary hover:bg-surface-2 hover:text-ink-primary",
                        )}
                      >
                        <div
                          className={cn(
                            "flex h-8 w-8 items-center justify-center rounded-lg",
                            isActive
                              ? "bg-accent-primary/10 text-accent-primary"
                              : "bg-bg-app text-ink-tertiary",
                          )}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{item.label}</div>
                          <div className="text-[10px] text-ink-tertiary truncate">{item.hint}</div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </nav>

              {/* Main Content */}
              <div className="flex-1 min-w-0">{children}</div>
            </div>
          </div>
        </div>
      </AppShell>

      <AppMenuDrawer isOpen={isOpen} onClose={closeMenu} />
    </>
  );
}
