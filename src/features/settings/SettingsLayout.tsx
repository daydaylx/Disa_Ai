import React from "react";
import { Link, useLocation } from "react-router-dom";

import { cn } from "@/lib/utils";
import { PageHeader } from "@/ui";

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
  },
  {
    id: "behavior",
    label: "KI Verhalten",
    icon: SlidersHorizontal,
    to: "/settings/behavior",
  },
  {
    id: "youth",
    label: "Jugendschutz",
    icon: Shield,
    to: "/settings/youth",
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

  return (
    <div className="flex flex-col w-full h-full overflow-y-auto">
      <div className="flex-1 px-4 py-6 max-w-4xl mx-auto w-full">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Navigation (Desktop Sidebar / Mobile Horizontal) */}
          <nav className="lg:w-56 flex-shrink-0">
            <div className="flex gap-2 overflow-x-auto pb-4 lg:flex-col lg:pb-0 no-scrollbar -mx-4 px-4 lg:mx-0 lg:px-0">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = derivedActive === item.id;
                return (
                  <Link
                    key={item.id}
                    to={item.to}
                    className={cn(
                      "flex-shrink-0 flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200",
                      "min-w-[140px] lg:min-w-0 lg:w-full",
                      isActive
                        ? "bg-brand-primary/10 border-brand-primary/30 text-brand-primary shadow-glow-sm"
                        : "bg-surface-1/40 border-transparent text-ink-secondary hover:bg-surface-1/60 hover:text-ink-primary hover:border-white/5",
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-4 w-4 transition-colors",
                        isActive
                          ? "text-brand-primary"
                          : "text-ink-tertiary group-hover:text-ink-primary",
                      )}
                    />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {(title || description) && (
              <div className="mb-8 pl-1">
                <PageHeader title={title || ""} description={description} />
              </div>
            )}
            <div className="space-y-6 animate-fade-in">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
