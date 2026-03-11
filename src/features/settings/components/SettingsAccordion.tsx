import type { LucideIcon } from "lucide-react";
import { type ReactNode, useId } from "react";

import { ChevronDown } from "@/lib/icons";

interface SettingsAccordionProps {
  icon: LucideIcon;
  title: string;
  description: string;
  isOpen: boolean;
  onToggle: () => void;
  children: ReactNode;
}

export function SettingsAccordion({
  icon: Icon,
  title,
  description,
  isOpen,
  onToggle,
  children,
}: SettingsAccordionProps) {
  const panelId = useId();

  return (
    <div className="relative overflow-hidden rounded-[24px] border border-white/[0.10] bg-surface-1/82 shadow-[0_16px_38px_-30px_rgba(0,0,0,0.76)] ring-1 ring-inset ring-white/[0.04] sm:backdrop-blur-xl">
      <div
        className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
        aria-hidden
      />
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="flex w-full items-center justify-between gap-4 p-4 text-left transition-colors hover:bg-white/[0.04] sm:p-5"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-accent-settings-border/40 bg-accent-settings-surface text-accent-settings shadow-inner">
            <Icon className="h-5 w-5" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-ink-primary sm:text-base">{title}</p>
            <p className="mt-1 text-xs leading-relaxed text-ink-tertiary sm:text-sm">
              {description}
            </p>
          </div>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/[0.08] bg-black/[0.10] text-ink-tertiary shadow-inner">
          <ChevronDown
            className={`h-5 w-5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      <div
        id={panelId}
        className="accordion-panel"
        data-open={isOpen ? "true" : "false"}
        aria-hidden={!isOpen}
      >
        <div className="accordion-inner border-t border-white/[0.06] bg-black/[0.08]">
          <div className="p-4 sm:p-5">{children}</div>
        </div>
      </div>
    </div>
  );
}
