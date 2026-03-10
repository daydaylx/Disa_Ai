import React from "react";
import { Link, useLocation } from "react-router-dom";

import { cn } from "@/lib/utils";
import { Badge, Card, PageHero } from "@/ui";

import {
  BookOpenCheck,
  Cat,
  Database,
  MessageSquare,
  Palette,
  SlidersHorizontal,
} from "../../lib/icons";

interface SettingsLayoutProps {
  children: React.ReactNode;
  activeTab?: "overview" | "memory" | "behavior" | "extras" | "api-data" | "appearance";
  title?: string;
  description?: string;
}

const NAV_ITEMS = [
  {
    id: "memory",
    label: "Gedächtnis",
    icon: BookOpenCheck,
    to: "/settings/memory",
  },
  {
    id: "behavior",
    label: "KI‑Verhalten",
    icon: SlidersHorizontal,
    to: "/settings/behavior",
  },
  {
    id: "appearance",
    label: "Darstellung",
    icon: Palette,
    to: "/settings/appearance",
  },
  {
    id: "extras",
    label: "Experimente",
    icon: Cat,
    to: "/settings/extras",
  },
  {
    id: "api-data",
    label: "API & Daten",
    icon: Database,
    to: "/settings/api-data",
  },
  {
    id: "feedback",
    label: "Feedback",
    icon: MessageSquare,
    to: "/feedback",
  },
] as const;

export function SettingsLayout({ children, activeTab, title, description }: SettingsLayoutProps) {
  const location = useLocation();

  const derivedActive = React.useMemo(() => {
    if (activeTab) return activeTab;
    const match = NAV_ITEMS.find((item) => location.pathname.startsWith(item.to));
    return match?.id;
  }, [activeTab, location.pathname]);
  const activeItem = React.useMemo(
    () => NAV_ITEMS.find((item) => item.id === derivedActive),
    [derivedActive],
  );
  const ActiveIcon = activeItem?.icon ?? SlidersHorizontal;

  return (
    <div className="relative isolate flex h-full w-full flex-col overflow-y-auto">
      <div
        className="pointer-events-none absolute left-1/2 top-0 hidden h-64 w-64 -translate-x-1/2 rounded-full blur-3xl sm:block"
        style={{
          background:
            "radial-gradient(circle, rgba(251,191,36,0.16) 0%, rgba(56,189,248,0.08) 50%, transparent 72%)",
          opacity: 0.45,
        }}
        aria-hidden="true"
      />

      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-4 sm:py-6">
        {(title || description) && (
          <PageHero
            title={title || ""}
            titleAs="h1"
            eyebrow="Einstellungen"
            description={description}
            icon={<ActiveIcon className="h-5 w-5" />}
            gradientStyle="linear-gradient(135deg, rgba(251,191,36,0.14) 0%, rgba(56,189,248,0.08) 55%, rgba(15,23,42,0.18) 100%)"
            meta={
              <>
                <Badge variant="settings">Bereich: {activeItem?.label ?? "Übersicht"}</Badge>
                <Badge className="rounded-full border-white/10 bg-white/[0.06] text-ink-secondary">
                  {NAV_ITEMS.length} Bereiche
                </Badge>
              </>
            }
            className="relative z-10"
          />
        )}

        <div className="mt-4 flex flex-col gap-6 lg:flex-row">
          {/* Navigation (Desktop Sidebar / Mobile Horizontal) */}
          <nav className="flex-shrink-0 lg:sticky lg:top-4 lg:w-64 lg:self-start">
            <Card variant="hero" padding="none" className="overflow-hidden rounded-[26px]">
              <div className="relative">
                <div className="flex gap-2 overflow-x-auto p-3 no-scrollbar -mx-0 lg:flex-col lg:pb-3">
                  {NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isActive = derivedActive === item.id;
                    return (
                      <Link
                        key={item.id}
                        to={item.to}
                        className={cn(
                          "group flex min-h-[52px] flex-shrink-0 items-center gap-3 rounded-2xl border px-4 py-3 transition-all duration-150",
                          "min-w-[152px] lg:min-w-0 lg:w-full",
                          "active:scale-[0.97] active:translate-y-px",
                          isActive
                            ? "border-accent-settings-border bg-accent-settings-dim/80 text-accent-settings shadow-[0_16px_30px_-24px_rgba(251,191,36,0.8)]"
                            : "border-transparent bg-surface-1/35 text-ink-secondary hover:border-white/[0.08] hover:bg-surface-1/60 hover:text-ink-primary",
                        )}
                      >
                        <div
                          className={cn(
                            "flex h-10 w-10 items-center justify-center rounded-2xl border transition-colors",
                            isActive
                              ? "border-accent-settings-border/60 bg-accent-settings-surface text-accent-settings"
                              : "border-white/6 bg-white/[0.04] text-ink-tertiary group-hover:text-ink-primary",
                          )}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <span className="block truncate text-sm font-medium">{item.label}</span>
                          <span className="block text-xs text-ink-tertiary">
                            {isActive ? "Aktueller Bereich" : "Öffnen"}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
                <div className="pointer-events-none absolute left-0 top-0 h-full w-6 bg-gradient-to-r from-bg-app/90 to-transparent lg:hidden" />
                <div className="pointer-events-none absolute right-0 top-0 h-full w-6 bg-gradient-to-l from-bg-app/90 to-transparent lg:hidden" />
              </div>
            </Card>
          </nav>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="space-y-6 sm:animate-fade-in">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
