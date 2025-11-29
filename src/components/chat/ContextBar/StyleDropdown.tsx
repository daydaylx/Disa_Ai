import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useState } from "react";

import { useSettings } from "@/hooks/useSettings";
import { Check, ChevronDown, Feather } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { useToasts } from "@/ui";

const STYLE_PRESETS = [
  { label: "Sachlich & direkt", value: 20, desc: "Präzise Fakten, wenig Ausschmückung." },
  { label: "Ausgewogen", value: 45, desc: "Die goldene Mitte. (Standard)" },
  { label: "Locker & kreativ", value: 75, desc: "Entspannter Ton, mehr Ideen." },
  { label: "Story & Roleplay", value: 90, desc: "Fantasievoll, immersiv, emotional." },
] as const;

export function StyleSelector() {
  const [open, setOpen] = useState(false);
  const { settings, setCreativity } = useSettings();
  const toasts = useToasts();

  const currentPreset = STYLE_PRESETS.reduce((prev, curr) =>
    Math.abs(curr.value - settings.creativity) < Math.abs(prev.value - settings.creativity)
      ? curr
      : prev,
  );

  const handleSelect = (preset: (typeof STYLE_PRESETS)[number]) => {
    setCreativity(preset.value);
    toasts.push({
      kind: "info",
      title: "Stil angepasst",
      message: `Neuer Stil: ${preset.label.split(" & ")[0]}`,
    });
  };

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild>
        <button
          className={cn(
            "group flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm transition-colors",
            "hover:bg-surface-2 active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/50",
            open && "bg-surface-2 text-ink-primary",
          )}
          aria-label="Schreibstil ändern"
        >
          <Feather className={cn("h-4 w-4 text-ink-secondary", open && "text-ink-primary")} />
          <span className="hidden sm:inline-block text-ink-primary font-medium">
            {currentPreset.label.split(" & ")[0]}
          </span>
          <ChevronDown
            className={cn(
              "h-3 w-3 text-ink-tertiary transition-transform duration-200",
              open && "rotate-180 text-ink-secondary",
            )}
          />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className={cn(
            "z-popover min-w-[220px] rounded-xl border border-border-ink bg-bg-page/95 p-1 shadow-floating backdrop-blur-sm",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
          )}
          side="top"
          sideOffset={8}
          align="center"
          collisionPadding={8}
        >
          <div className="px-2 py-1.5 text-xs font-medium text-ink-secondary uppercase tracking-wider">
            Schreibstil
          </div>

          {STYLE_PRESETS.map((preset) => (
            <DropdownMenu.Item
              key={preset.value}
              onSelect={() => handleSelect(preset)}
              className={cn(
                "relative flex select-none flex-col rounded-md px-2 py-2 text-sm outline-none transition-colors cursor-pointer",
                "hover:bg-surface-2 focus:bg-surface-2 data-[highlighted]:bg-surface-2",
                settings.creativity === preset.value && "bg-surface-1 shadow-sm",
              )}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-ink-primary">{preset.label}</span>
                {Math.abs(settings.creativity - preset.value) < 5 && (
                  <Check className="h-3.5 w-3.5 text-accent-primary" />
                )}
              </div>
              <span className="text-xs text-ink-secondary mt-0.5">{preset.desc}</span>
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
