import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useState } from "react";

import { useSettings } from "@/hooks/useSettings";
import { cn } from "@/lib/utils";

import { ContextBadge } from "./ContextBadge";

const CONTEXT_OPTIONS = [
  { label: "Kurz", value: 5 },
  { label: "Mittel", value: 8 },
  { label: "Lang", value: 12 },
] as const;

/**
 * QuickSettingsDropdown: AI Behavior Settings
 * Only includes settings that affect AI behavior (not UI preferences).
 *
 * Current settings:
 * - Antwortlänge (Context Length): Controls how long/detailed AI responses should be
 */
export function ContextLengthSelector() {
  const [open, setOpen] = useState(false);
  const { settings, setDiscussionMaxSentences } = useSettings();

  const currentOption = CONTEXT_OPTIONS.find((option) => {
    if (option.value === 5) return settings.discussionMaxSentences <= 5;
    if (option.value === 8)
      return settings.discussionMaxSentences > 5 && settings.discussionMaxSentences < 12;
    return settings.discussionMaxSentences >= 12;
  });

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild>
        <ContextBadge
          label={`Kontextlänge: ${currentOption?.label ?? "Mittel"}`}
          isOpen={open}
          aria-label="Antwortlänge einstellen"
          className="max-w-[200px]"
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
          align="end"
          collisionPadding={8}
        >
          {CONTEXT_OPTIONS.map((option) => (
            <DropdownMenu.Item
              key={option.value}
              onSelect={() => {
                setDiscussionMaxSentences(option.value);
                setOpen(false);
              }}
              className={cn(
                "flex select-none items-center justify-between rounded-md px-3 py-2 text-sm outline-none transition-colors",
                "hover:bg-surface-2 focus:bg-surface-2 data-[highlighted]:bg-surface-2",
                ((option.value === 5 && settings.discussionMaxSentences <= 5) ||
                  (option.value === 8 &&
                    settings.discussionMaxSentences > 5 &&
                    settings.discussionMaxSentences < 12) ||
                  (option.value === 12 && settings.discussionMaxSentences >= 12)) &&
                  "bg-surface-1",
              )}
            >
              <span className="truncate text-left">{option.label}</span>
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
