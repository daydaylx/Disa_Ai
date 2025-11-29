import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useState } from "react";
import { Link } from "react-router-dom";

import { useSettings } from "@/hooks/useSettings";
import { Cat, ExternalLink, Settings2, Zap, ZapOff } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { Switch } from "@/ui/Switch";

export function QuickSettingsSelector() {
  const [open, setOpen] = useState(false);
  const { settings, setDiscussionMaxSentences, setReduceMotion, toggleNeko } = useSettings();

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild>
        <button
          className={cn(
            "group flex items-center justify-center rounded-lg p-2 transition-colors",
            "hover:bg-surface-2 active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/50",
            open && "bg-surface-2",
          )}
          aria-label="Schnell-Einstellungen"
        >
          <Settings2
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
            "z-popover w-[280px] rounded-xl border border-border-ink bg-bg-page/95 p-2 shadow-floating backdrop-blur-sm",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
          )}
          side="top"
          sideOffset={8}
          align="end"
          collisionPadding={8}
        >
          {/* Antwortlänge */}
          <div className="px-2 py-2">
            <div className="mb-2 text-xs font-medium text-ink-secondary uppercase tracking-wider">
              Antwortlänge
            </div>
            <div className="flex rounded-md bg-surface-1 p-1">
              {[
                { label: "Kurz", value: 5 },
                { label: "Mittel", value: 8 },
                { label: "Lang", value: 12 },
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
                      "flex-1 rounded-sm py-1 text-xs font-medium transition-all",
                      isActive
                        ? "bg-surface-2 text-ink-primary shadow-sm"
                        : "text-ink-secondary hover:text-ink-primary hover:bg-surface-2/50",
                    )}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="my-1 h-px bg-border-ink/50" />

          {/* Toggles */}
          <div className="space-y-1 p-1">
            <DropdownMenu.Item
              className="flex select-none items-center justify-between rounded-md px-2 py-2 text-sm outline-none hover:bg-surface-2 focus:bg-surface-2 cursor-pointer"
              onSelect={(e) => {
                e.preventDefault();
                toggleNeko();
              }}
            >
              <div className="flex items-center gap-2 text-ink-primary">
                <Cat className="h-4 w-4 text-ink-secondary" />
                <span>Neko Mascot</span>
              </div>
              <Switch checked={settings.enableNeko} onCheckedChange={toggleNeko} />
            </DropdownMenu.Item>

            <DropdownMenu.Item
              className="flex select-none items-center justify-between rounded-md px-2 py-2 text-sm outline-none hover:bg-surface-2 focus:bg-surface-2 cursor-pointer"
              onSelect={(e) => {
                e.preventDefault();
                setReduceMotion(!settings.reduceMotion);
              }}
            >
              <div className="flex items-center gap-2 text-ink-primary">
                {settings.reduceMotion ? (
                  <ZapOff className="h-4 w-4 text-ink-secondary" />
                ) : (
                  <Zap className="h-4 w-4 text-ink-secondary" />
                )}
                <span>Reduzierte Motion</span>
              </div>
              <Switch checked={settings.reduceMotion} onCheckedChange={(c) => setReduceMotion(c)} />
            </DropdownMenu.Item>
          </div>

          <div className="my-1 h-px bg-border-ink/50" />

          {/* Links */}
          <div className="p-1">
            <Link
              to="/settings"
              className="flex w-full items-center justify-between rounded-md px-2 py-2 text-sm text-ink-primary hover:bg-surface-2 transition-colors"
            >
              <span>Alle Einstellungen</span>
              <ExternalLink className="h-3.5 w-3.5 text-ink-secondary" />
            </Link>
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
