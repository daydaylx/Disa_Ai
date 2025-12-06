import React from "react";
import { Link, useLocation } from "react-router-dom";

import { cn } from "@/lib/utils";
import { PageHeader } from "@/ui";

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
          <div className="flex-1 px-xs py-md max-w-3xl mx-auto w-full">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Navigation (Desktop Sidebar / Mobile Horizontal) */}
              <nav className="lg:w-48 flex-shrink-0">
                <div className="flex gap-2 overflow-x-auto pb-xs lg:flex-col lg:pb-0 no-scrollbar -mx-xs px-xs lg:mx-0 lg:px-0">
                  {NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isActive = derivedActive === item.id;
                    return (
                      <Link
                        key={item.id}
                        to={item.to}
                        className={cn(
                          "flex-shrink-0 flex items-center gap-2 px-2xs py-3xs rounded-xl border transition-all",
                          "min-w-[120px] lg:min-w-0 lg:w-full",
                          isActive
                            ? "bg-surface-1 border-accent-primary/30 text-ink-primary"
                            : "bg-transparent border-transparent text-ink-secondary hover:bg-surface-1 hover:text-ink-primary",
                        )}
                      >
                        <Icon className={cn("h-4 w-4", isActive && "text-accent-primary")} />
                        <span className="text-sm font-medium">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </nav>

              {/* Main Content */}
              <div className="flex-1 min-w-0">
                {(title || description) && (
                  <PageHeader title={title || ""} description={description} className="mb-6" />
                )}
                {children}
              </div>
            </div>
          </div>
        </div>
      </AppShell>

      <AppMenuDrawer isOpen={isOpen} onClose={closeMenu} />
    </>
  );
}
