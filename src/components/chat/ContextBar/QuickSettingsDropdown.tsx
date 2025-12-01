import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useState } from "react";

import { useSettings } from "@/hooks/useSettings";
import { Settings } from "@/lib/icons";
import { cn } from "@/lib/utils";

/**
 * QuickSettingsDropdown: AI Behavior Settings
 * Only includes settings that affect AI behavior (not UI preferences).
 *
 * Current settings:
 * - Antwortlänge (Context Length): Controls how long/detailed AI responses should be
 */
export function QuickSettingsSelector() {
  const [open, setOpen] = useState(false);
  const { settings, setDiscussionMaxSentences } = useSettings();

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild>
        <button
          className={cn(
            "group flex items-center justify-center rounded-lg p-2 transition-colors",
            "hover:bg-surface-2 active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/50",
            open && "bg-surface-2",
          )}
          aria-label="KI-Verhalten anpassen"
        >
          <Settings
            className={cn(
              "h-5 w-5 text-ink-secondary transition-colors",
              open && "text-ink-primary",
            )}
          />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className={cn(
            "z-popover w-[260px] rounded-xl border border-border-ink bg-bg-page/95 p-2 shadow-floating backdrop-blur-sm",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
          )}
          side="top"
          sideOffset={8}
          align="end"
          collisionPadding={8}
        >
          {/* Antwortlänge / Context Length */}
          <div className="px-2 py-2">
            <div className="mb-2 text-xs font-medium text-ink-secondary uppercase tracking-wider">
              Antwortlänge
            </div>
            <div className="text-xs text-ink-tertiary mb-2 px-1">
              Wie ausführlich sollen Antworten sein?
            </div>
            <div className="flex rounded-md bg-surface-1 p-1">
              {[
                { label: "Kurz", value: 5, desc: "Knapp & präzise" },
                { label: "Mittel", value: 8, desc: "Ausgewogen" },
                { label: "Lang", value: 12, desc: "Detailliert" },
              ].map((opt) => {
                const isActive =
                  (opt.value === 5 && settings.discussionMaxSentences <= 5) ||
                  (opt.value === 8 &&
                    settings.discussionMaxSentences > 5 &&
                    settings.discussionMaxSentences < 12) ||
                  (opt.value === 12 && settings.discussionMaxSentences >= 12);

                return (
                  <button
                    key={opt.value}
                    onClick={() => setDiscussionMaxSentences(opt.value)}
                    className={cn(
                      "flex-1 rounded-sm py-2 text-xs font-medium transition-all",
                      isActive
                        ? "bg-surface-2 text-ink-primary shadow-sm"
                        : "text-ink-secondary hover:text-ink-primary hover:bg-surface-2/50",
                    )}
                    title={opt.desc}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
