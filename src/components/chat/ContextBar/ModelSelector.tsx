import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useState } from "react";

import type { ModelEntry } from "@/config/models";
import { useSettings } from "@/hooks/useSettings";
import { cn } from "@/lib/utils";

import { ContextBadge } from "./ContextBadge";
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
  const label = currentModel?.label || settings.preferredModelId.split("/").pop() || "Modell";

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild>
        <ContextBadge
          label={label}
          isOpen={open}
          aria-label={`Aktuelles Modell: ${fullLabel}. Ändern…`}
          className="max-w-[150px] sm:max-w-[180px]"
        />
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
