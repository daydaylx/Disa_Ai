import * as React from "react";

import { cn } from "../../lib/cn";

export interface GlassTab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  badge?: string | number;
  "aria-label"?: string;
}

interface GlassTabsProps {
  tabs: GlassTab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
  variant?: "default" | "compact" | "large";
  orientation?: "horizontal" | "vertical";
  fullWidth?: boolean;
}

const variantClasses = {
  default: "p-1",
  compact: "p-0.5",
  large: "p-1.5",
} as const;

const tabSizeClasses = {
  default: "px-5 py-3 text-sm",
  compact: "px-3 py-2 text-xs",
  large: "px-6 py-4 text-base",
} as const;

export function GlassTabs({
  tabs,
  activeTab,
  onTabChange,
  className,
  variant = "default",
  orientation = "horizontal",
  fullWidth = false,
}: GlassTabsProps) {
  const handleTabClick = (tab: GlassTab) => {
    if (!tab.disabled) {
      onTabChange(tab.id);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent, tab: GlassTab) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleTabClick(tab);
    }
  };

  return (
    <div
      className={cn(
        "glass-tabs",
        variantClasses[variant],
        orientation === "vertical" && "flex-col",
        fullWidth && "w-full",
        className,
      )}
      role="tablist"
      aria-orientation={orientation}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={isActive}
            aria-controls={`tabpanel-${tab.id}`}
            aria-label={tab["aria-label"] || tab.label}
            disabled={tab.disabled}
            className={cn(
              "glass-tab",
              tabSizeClasses[variant],
              isActive && "glass-tab--active",
              tab.disabled && "cursor-not-allowed opacity-50",
              fullWidth && "flex-1",
              "relative flex items-center justify-center gap-2",
              "focus-visible:ring-accent-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
            )}
            onClick={() => handleTabClick(tab)}
            onKeyDown={(e) => handleKeyDown(e, tab)}
          >
            {tab.icon && (
              <span
                className={cn(
                  "flex-shrink-0",
                  isActive ? "text-accent-foreground" : "text-neutral-400",
                )}
              >
                {tab.icon}
              </span>
            )}

            <span
              className={cn(
                "font-medium",
                isActive ? "text-accent-foreground" : "text-neutral-200",
              )}
            >
              {tab.label}
            </span>

            {tab.badge && (
              <span
                className={cn(
                  "glass-badge glass-badge--accent",
                  "ml-1 text-xs leading-none",
                  "flex h-5 min-w-[1.25rem] items-center justify-center",
                )}
              >
                {tab.badge}
              </span>
            )}

            {isActive && (
              <div
                className="rounded-inherit pointer-events-none absolute inset-0"
                aria-hidden="true"
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

export interface GlassTabPanelProps {
  children: React.ReactNode;
  tabId: string;
  activeTab: string;
  className?: string;
}

export function GlassTabPanel({ children, tabId, activeTab, className }: GlassTabPanelProps) {
  const isActive = activeTab === tabId;

  return (
    <div
      id={`tabpanel-${tabId}`}
      role="tabpanel"
      aria-labelledby={`tab-${tabId}`}
      hidden={!isActive}
      className={cn("glass-tab-panel", !isActive && "sr-only", className)}
    >
      {isActive && children}
    </div>
  );
}

export interface GlassTabsContainerProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "floating" | "sidebar";
}

export function GlassTabsContainer({
  children,
  className,
  variant = "default",
}: GlassTabsContainerProps) {
  const variantStyles = {
    default: "",
    floating: "glass-panel glass-panel--floating",
    sidebar: "glass-sidebar",
  };

  return (
    <div className={cn("glass-tabs-container", variantStyles[variant], className)}>{children}</div>
  );
}
