import { Link, useNavigate } from "react-router-dom";

import { cn } from "@/lib/utils";
import { Button } from "@/ui/Button";

import {
  BookOpenCheck,
  Cat,
  ChevronLeft,
  Database,
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
  { id: "memory", label: "Gedächtnis", icon: BookOpenCheck, to: "/settings/memory" },
  { id: "behavior", label: "KI Verhalten", icon: SlidersHorizontal, to: "/settings/behavior" },
  { id: "youth", label: "Jugendschutz", icon: Shield, to: "/settings/youth" },
  { id: "extras", label: "Extras", icon: Cat, to: "/settings/extras" },
  { id: "api-data", label: "API & Daten", icon: Database, to: "/settings/api-data" },
] as const;

export function SettingsLayout({ children, activeTab, title, description }: SettingsLayoutProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full text-text-primary">
      {/* Mobile Header & Navigation */}
      <div className="md:hidden bg-surface-1 border-b border-surface-2 sticky top-0 z-20">
        <div className="flex items-center gap-2 px-4 pt-3 pb-1">
          <Button variant="ghost" size="sm" onClick={() => navigate("/settings")} className="-ml-2">
            <ChevronLeft className="h-5 w-5 mr-1" />
            <span className="text-base font-semibold">Einstellungen</span>
          </Button>
        </div>

        {/* Scrollable Horizontal Tabs */}
        <div className="flex overflow-x-auto py-2 px-4 gap-2 no-scrollbar snap-x">
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <Link
                key={item.id}
                to={item.to}
                className={cn(
                  "flex-shrink-0 snap-start px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap",
                  isActive
                    ? "bg-brand text-white shadow-brandGlow"
                    : "bg-surface-2 text-text-secondary hover:bg-surface-3 hover:text-text-primary",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex flex-col w-64 border-r border-surface-2 bg-surface-1 shrink-0">
          <div className="p-6 pb-4">
            <h1 className="text-xl font-bold text-text-primary flex items-center gap-2">
              <SettingsIcon className="h-5 w-5 text-text-secondary" />
              Einstellungen
            </h1>
          </div>

          <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <Link
                  key={item.id}
                  to={item.to}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-fast",
                    isActive
                      ? "bg-brand/10 text-brand shadow-brandGlow"
                      : "text-text-secondary hover:text-text-primary hover:bg-surface-2",
                  )}
                >
                  <Icon
                    className={cn("h-4 w-4", isActive ? "text-brand" : "text-text-secondary")}
                  />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto w-full">
            {/* Optional Header inside Layout */}
            {(title || description) && (
              <div className="px-4 py-4 sm:px-8 sm:pt-8 sm:pb-4">
                <h2 className="text-2xl font-bold text-text-primary">{title}</h2>
                {description && <p className="mt-1 text-text-secondary">{description}</p>}
              </div>
            )}

            <div className="px-0 sm:px-8 py-4">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
