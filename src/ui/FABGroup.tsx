import { useState } from "react";

import { hapticFeedback } from "@/lib/haptics";
import type { LucideIcon } from "@/lib/icons";
import { Plus, X } from "@/lib/icons";
import { cn } from "@/lib/utils";

export interface FABAction {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  variant?: "default" | "primary" | "danger";
}

interface FABGroupProps {
  actions: FABAction[];
  className?: string;
}

/**
 * FAB Group - Expandable Floating Action Button
 *
 * Mobile-optimierte FAB-Gruppe mit Expand/Collapse-Animation.
 * Zeigt primären Plus-Button, expandiert zu Aktionen bei Klick.
 *
 * @example
 * <FABGroup
 *   actions={[
 *     { icon: MessageSquare, label: 'Neuer Chat', onClick: handleNewChat },
 *     { icon: Settings, label: 'Einstellungen', onClick: handleSettings },
 *   ]}
 * />
 */
export function FABGroup({ actions, className }: FABGroupProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    hapticFeedback("light");
    setIsExpanded(!isExpanded);
  };

  const handleAction = (action: FABAction) => {
    hapticFeedback(action.variant === "danger" ? "warning" : "medium");
    action.onClick();
    setIsExpanded(false);
  };

  return (
    <div
      className={cn(
        "fixed bottom-24 right-4 z-fab flex flex-col-reverse items-end gap-3",
        "pb-safe-bottom pr-safe-right",
        className,
      )}
    >
      {/* Actions - shown when expanded */}
      {isExpanded && (
        <>
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                onClick={() => handleAction(action)}
                className={cn(
                  "group flex items-center gap-3 animate-fade-in-scale",
                  "transition-all duration-200",
                )}
                style={{ animationDelay: `${index * 50}ms` }}
                aria-label={action.label}
              >
                {/* Label */}
                <span className="rounded-full bg-surface-2/95 backdrop-blur-md px-3 py-1.5 text-xs font-medium text-ink-primary border border-white/10 shadow-lg whitespace-nowrap">
                  {action.label}
                </span>

                {/* Icon Button */}
                <div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-full shadow-lg",
                    "transition-all duration-200",
                    "border border-white/10",
                    "active:scale-95",
                    action.variant === "primary" &&
                      "bg-brand-primary text-white hover:shadow-glow-md",
                    action.variant === "danger" &&
                      "bg-status-error text-white hover:shadow-[0_0_16px_rgba(239,68,68,0.4)]",
                    !action.variant &&
                      "bg-surface-2/95 backdrop-blur-md text-ink-primary hover:bg-surface-3",
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
              </button>
            );
          })}
        </>
      )}

      {/* Main Toggle Button */}
      <button
        onClick={handleToggle}
        className={cn(
          "flex h-14 w-14 items-center justify-center rounded-full",
          "bg-accent-chat text-white shadow-lg hover:shadow-glow-md",
          "border border-white/10",
          "transition-all duration-300",
          "active:scale-95",
          isExpanded && "rotate-45 bg-surface-3 text-ink-primary",
        )}
        aria-label={isExpanded ? "Schließen" : "Aktionen öffnen"}
        aria-expanded={isExpanded}
      >
        {isExpanded ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
      </button>
    </div>
  );
}
