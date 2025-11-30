import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useState } from "react";

import type { ModelEntry } from "@/config/models";
import { useSettings } from "@/hooks/useSettings";
import { ChevronUp } from "@/lib/icons";
import { cn } from "@/lib/utils";

import { ModelDropdown } from "./ModelDropdown";

interface ModelSelectorProps {
  catalog: ModelEntry[] | null;
}

export function ModelSelector({ catalog }: ModelSelectorProps) {
  const [open, setOpen] = useState(false);
  const { settings, setPreferredModel } = useSettings();

  // Find current label - shortened for mobile
  const currentModel = catalog?.find((m) => m.id === settings.preferredModelId);
  const fullLabel = currentModel?.label || settings.preferredModelId.split("/").pop() || "Auto";
  // Shorten long labels for mobile
  const shortLabel = fullLabel.length > 12 ? fullLabel.slice(0, 10) + "…" : fullLabel;

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild>
        <button
          className={cn(
            "group flex items-center gap-1 rounded-full border border-border-ink bg-surface-1 pl-2.5 pr-1.5 py-1.5 text-xs sm:text-sm font-medium text-ink-primary transition-all duration-200",
            "hover:bg-surface-2 hover:border-border-ink/80 active:scale-[0.98]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/50",
            open && "bg-ink-primary text-surface-1 border-ink-primary hover:bg-ink-primary/90",
          )}
          aria-label={`Aktuelles Modell: ${fullLabel}. Ändern…`}
        >
          <span className="truncate max-w-[60px] sm:max-w-[100px]">{shortLabel}</span>
          <ChevronUp
            className={cn(
              "h-3 w-3 sm:h-3.5 sm:w-3.5 text-ink-secondary transition-transform duration-200",
              open ? "text-surface-1/70 rotate-180" : "group-hover:text-ink-primary",
            )}
          />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className={cn(
            "z-popover min-w-[240px] rounded-xl border border-border-ink bg-bg-page/95 p-0 shadow-floating backdrop-blur-sm",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
          )}
          side="top"
          sideOffset={8}
          collisionPadding={8}
          align="end"
        >
          <ModelDropdown
            currentModelId={settings.preferredModelId}
            catalog={catalog}
            onSelect={setPreferredModel}
            onClose={() => setOpen(false)}
          />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
