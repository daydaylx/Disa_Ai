import { useEffect, useState } from "react";

import { ChevronDown, ChevronUp, Cpu, HardDrive, User } from "@/lib/icons";
import { cn } from "@/lib/utils";

interface ChatQuickSettingsProps {
  activeModelLabel: string;
  roleLabel: string;
  memoryEnabled: boolean;
  onNavigateModels: () => void;
  onNavigateRoles: () => void;
  onNavigateMemory: () => void;
}

export function ChatQuickSettings({
  activeModelLabel,
  roleLabel,
  memoryEnabled,
  onNavigateModels,
  onNavigateRoles,
  onNavigateMemory,
}: ChatQuickSettingsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Auto-collapse after 5s idle
  useEffect(() => {
    if (!isExpanded) return;

    const timer = setTimeout(() => {
      setIsExpanded(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, [isExpanded]);

  if (!isExpanded) {
    // Collapsed State: Single Chip
    return (
      <button
        type="button"
        onClick={() => setIsExpanded(true)}
        className={cn(
          "inline-flex min-h-[44px] items-center gap-2 rounded-full border bg-surface-1/70 px-3 py-2",
          "text-xs font-medium text-ink-secondary transition-colors whitespace-nowrap",
          "border-white/10 hover:border-white/20 hover:text-ink-primary",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/60",
        )}
        aria-label="Einstellungen anzeigen"
        aria-expanded="false"
      >
        <ChevronDown className="h-3.5 w-3.5" />
        <span>Einstellungen</span>
      </button>
    );
  }

  // Expanded State: 3 Pills + Collapse Button
  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
      <button
        type="button"
        onClick={onNavigateModels}
        className={cn(
          "inline-flex min-h-[44px] items-center gap-2 rounded-full border bg-surface-1/70 px-3 py-2",
          "text-xs font-medium text-ink-secondary transition-colors whitespace-nowrap",
          "border-accent-models/30 hover:border-accent-models/50 hover:text-ink-primary",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-models/60",
        )}
        aria-label={`Aktives Modell: ${activeModelLabel}`}
      >
        <Cpu className="h-3.5 w-3.5 text-accent-models" />
        <span>Modell: {activeModelLabel}</span>
      </button>

      <button
        type="button"
        onClick={onNavigateRoles}
        className={cn(
          "inline-flex min-h-[44px] items-center gap-2 rounded-full border bg-surface-1/70 px-3 py-2",
          "text-xs font-medium text-ink-secondary transition-colors whitespace-nowrap",
          "border-accent-roles/30 hover:border-accent-roles/50 hover:text-ink-primary",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-roles/60",
        )}
        aria-label={`Aktive Rolle: ${roleLabel}`}
      >
        <User className="h-3.5 w-3.5 text-accent-roles" />
        <span>Rolle: {roleLabel}</span>
      </button>

      <button
        type="button"
        onClick={onNavigateMemory}
        className={cn(
          "inline-flex min-h-[44px] items-center gap-2 rounded-full border bg-surface-1/70 px-3 py-2",
          "text-xs font-medium transition-colors whitespace-nowrap",
          memoryEnabled
            ? "border-status-success/35 text-ink-secondary hover:border-status-success/50 hover:text-ink-primary"
            : "border-status-warning/35 text-ink-secondary hover:border-status-warning/50 hover:text-ink-primary",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/60",
        )}
        aria-label={`Memory ist ${memoryEnabled ? "aktiv" : "deaktiviert"}`}
      >
        <HardDrive
          className={cn(
            "h-3.5 w-3.5",
            memoryEnabled ? "text-status-success" : "text-status-warning",
          )}
        />
        <span>Memory: {memoryEnabled ? "Aktiv" : "Aus"}</span>
      </button>

      <button
        type="button"
        onClick={() => setIsExpanded(false)}
        className={cn(
          "inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border bg-surface-1/70 p-2",
          "text-xs font-medium text-ink-secondary transition-colors",
          "border-white/10 hover:border-white/20 hover:text-ink-primary",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/60",
        )}
        aria-label="Einstellungen einklappen"
        aria-expanded="true"
      >
        <ChevronUp className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
