import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useMemo, useState } from "react";

import { useSettings } from "@/hooks/useSettings";
import { Check, SlidersHorizontal } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { discussionPresetOptions } from "@/prompts/discussion/presets";
import { Button } from "@/ui/Button";

const CREATIVITY_OPTIONS = [
  { label: "Niedrig", value: 20 },
  { label: "Ausgewogen", value: 45 },
  { label: "Kreativ", value: 70 },
  { label: "Maximal", value: 90 },
] as const;

const CONTEXT_OPTIONS = [
  { label: "Kurz", value: 5 },
  { label: "Mittel", value: 8 },
  { label: "Lang", value: 12 },
] as const;

export function QuickSettingsDropdown() {
  const [open, setOpen] = useState(false);
  const { settings, setCreativity, setDiscussionMaxSentences, setDiscussionPreset } = useSettings();

  const currentCreativity = useMemo(
    () =>
      CREATIVITY_OPTIONS.reduce((prev, curr) =>
        Math.abs(curr.value - settings.creativity) < Math.abs(prev.value - settings.creativity)
          ? curr
          : prev,
      ),
    [settings.creativity],
  );

  const currentContext = useMemo(() => {
    const option = CONTEXT_OPTIONS.find((item) => {
      if (item.value === 5) return settings.discussionMaxSentences <= 5;
      if (item.value === 8)
        return settings.discussionMaxSentences > 5 && settings.discussionMaxSentences < 12;
      return settings.discussionMaxSentences >= 12;
    });

    return option ?? CONTEXT_OPTIONS[1];
  }, [settings.discussionMaxSentences]);

  const currentPreset = useMemo(
    () =>
      discussionPresetOptions.find((option) => option.key === settings.discussionPreset) ??
      discussionPresetOptions[0] ?? {
        key: "freundlich_offen",
        label: "Stil",
      },
    [settings.discussionPreset],
  );

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild>
        <Button
          variant="secondary"
          size="icon"
          className="h-10 w-10 rounded-xl border border-border-ink bg-surface-1 text-ink-primary hover:bg-surface-2"
          aria-label="Schnelleinstellungen"
          title="Stil, Kreativität und Kontext"
        >
          <SlidersHorizontal className="h-4.5 w-4.5" />
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className={cn(
            "z-popover w-[260px] rounded-xl border border-border-ink bg-bg-page/95 p-1 shadow-floating backdrop-blur-sm",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
          )}
          side="top"
          sideOffset={10}
          align="end"
          collisionPadding={8}
        >
          <div className="flex flex-col gap-1.5">
            <DropdownMenu.Label className="px-3 pt-2 text-[11px] font-semibold uppercase tracking-wide text-ink-tertiary">
              Schnelleinstellungen
            </DropdownMenu.Label>

            <Section
              title="Stil"
              value={currentPreset.label}
              items={discussionPresetOptions.map((preset) => ({
                key: preset.key,
                label: preset.label,
                onSelect: () => setDiscussionPreset(preset.key),
                active: settings.discussionPreset === preset.key,
              }))}
            />

            <DropdownMenu.Separator className="mx-3 h-px bg-border-ink/60" />

            <Section
              title="Kreativ"
              value={currentCreativity.label}
              items={CREATIVITY_OPTIONS.map((option) => ({
                key: option.value.toString(),
                label: option.label,
                onSelect: () => setCreativity(option.value),
                active: Math.abs(settings.creativity - option.value) < 5,
              }))}
            />

            <DropdownMenu.Separator className="mx-3 h-px bg-border-ink/60" />

            <Section
              title="Länge"
              value={currentContext.label}
              items={CONTEXT_OPTIONS.map((option) => ({
                key: option.value.toString(),
                label: option.label,
                onSelect: () => setDiscussionMaxSentences(option.value),
                active:
                  (option.value === 5 && settings.discussionMaxSentences <= 5) ||
                  (option.value === 8 &&
                    settings.discussionMaxSentences > 5 &&
                    settings.discussionMaxSentences < 12) ||
                  (option.value === 12 && settings.discussionMaxSentences >= 12),
              }))}
            />
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

interface SectionProps {
  title: string;
  value: string;
  items: { key: string; label: string; onSelect: () => void; active: boolean }[];
}

function Section({ title, value, items }: SectionProps) {
  return (
    <div className="px-1 pb-1">
      <div className="flex items-center justify-between px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-ink-secondary">
        <span>{title}</span>
        <span className="truncate text-ink-tertiary">{value}</span>
      </div>
      <div className="rounded-lg border border-border-ink/70 bg-surface-1/60">
        {items.map((item, index) => (
          <DropdownMenu.Item
            key={item.key}
            onSelect={() => item.onSelect()}
            className={cn(
              "flex select-none items-center justify-between px-3 py-2 text-sm outline-none transition-colors",
              "hover:bg-surface-2 focus:bg-surface-2 data-[highlighted]:bg-surface-2",
              index !== items.length - 1 && "border-b border-border-ink/50",
              item.active && "bg-surface-1",
            )}
          >
            <span className="truncate text-left">{item.label}</span>
            {item.active && <Check className="h-3.5 w-3.5 text-accent-primary" />}
          </DropdownMenu.Item>
        ))}
      </div>
    </div>
  );
}
