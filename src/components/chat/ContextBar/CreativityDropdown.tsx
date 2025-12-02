import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useState } from "react";

import { useSettings } from "@/hooks/useSettings";
import { Check } from "@/lib/icons";
import { cn } from "@/lib/utils";

import { ContextBadge } from "./ContextBadge";

const CREATIVITY_OPTIONS = [
  { label: "Niedrig", value: 20 },
  { label: "Ausgewogen", value: 45 },
  { label: "Kreativ", value: 70 },
  { label: "Maximal", value: 90 },
] as const;

export function CreativitySelector() {
  const [open, setOpen] = useState(false);
  const { settings, setCreativity } = useSettings();

  const currentOption = CREATIVITY_OPTIONS.reduce((prev, curr) =>
    Math.abs(curr.value - settings.creativity) < Math.abs(prev.value - settings.creativity)
      ? curr
      : prev,
  );

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild>
        <ContextBadge
          label={`Kreativität: ${currentOption.label}`}
          isOpen={open}
          aria-label="Kreativität anpassen"
          className="max-w-[190px]"
        />
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className={cn(
            "z-popover min-w-[200px] rounded-xl border border-border-ink bg-bg-page/95 p-1 shadow-floating backdrop-blur-sm",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
          )}
          side="top"
          sideOffset={8}
          align="center"
          collisionPadding={8}
        >
          {CREATIVITY_OPTIONS.map((option) => (
            <DropdownMenu.Item
              key={option.value}
              onSelect={() => {
                setCreativity(option.value);
                setOpen(false);
              }}
              className={cn(
                "flex select-none items-center justify-between rounded-md px-3 py-2 text-sm outline-none transition-colors",
                "hover:bg-surface-2 focus:bg-surface-2 data-[highlighted]:bg-surface-2",
                Math.abs(settings.creativity - option.value) < 5 && "bg-surface-1",
              )}
            >
              <span className="truncate text-left">{option.label}</span>
              {Math.abs(settings.creativity - option.value) < 5 && (
                <Check className="h-3.5 w-3.5 text-accent-primary" />
              )}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
