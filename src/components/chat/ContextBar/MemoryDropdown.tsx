import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useState } from "react";

import { useMemory } from "@/hooks/useMemory";
import { Brain } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { useToasts } from "@/ui";
import { Switch } from "@/ui/Switch";

export function MemorySelector() {
  const [open, setOpen] = useState(false);
  const { isEnabled, toggleMemory } = useMemory();
  const toasts = useToasts();

  const handleToggle = () => {
    toggleMemory();
    // Toast feedback after toggle
    // Using timeout to ensure state might have updated or just logical feedback
    setTimeout(() => {
      toasts.push({
        kind: isEnabled ? "info" : "success", // If it WAS enabled, now disabled (info). WAS disabled, now enabled (success).
        title: !isEnabled ? "Gedächtnis aktiviert" : "Gedächtnis deaktiviert",
        message: !isEnabled
          ? "Disa merkt sich nun Details aus dieser Unterhaltung."
          : "Disa vergisst diese Unterhaltung nach dem Schließen.",
      });
    }, 100);
  };

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild>
        <button
          className={cn(
            "group flex items-center justify-center rounded-lg p-2 transition-colors",
            "hover:bg-surface-2 active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/50",
            open && "bg-surface-2",
          )}
          aria-label="Gedächtnis-Einstellungen"
        >
          <Brain
            className={cn(
              "h-5 w-5 transition-colors",
              isEnabled ? "fill-ink-primary text-ink-primary" : "text-ink-secondary",
              open && "text-ink-primary",
            )}
          />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className={cn(
            "z-popover w-[260px] rounded-xl border border-border-ink bg-bg-page/95 p-3 shadow-floating backdrop-blur-sm",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
          )}
          side="top"
          sideOffset={8}
          align="center"
          collisionPadding={8}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2 font-medium text-ink-primary">
                <span>Chat-Gedächtnis</span>
                {isEnabled && <span className="flex h-1.5 w-1.5 rounded-full bg-green-500" />}
              </div>
              <p className="text-xs text-ink-secondary leading-relaxed">
                {isEnabled
                  ? "Disa erinnert sich an Details aus dieser Unterhaltung."
                  : "Disa vergisst alles, sobald du den Chat schließt."}
              </p>
            </div>
            <Switch checked={isEnabled} onCheckedChange={handleToggle} className="mt-0.5" />
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
