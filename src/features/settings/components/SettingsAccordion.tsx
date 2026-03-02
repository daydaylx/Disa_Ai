import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

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
  return (
    <div className="rounded-xl bg-surface-card border border-white/[0.10] overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 bg-surface-card hover:bg-surface-2/80 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5 text-accent-settings" />
          <div className="text-left">
            <p className="font-semibold text-ink-primary">{title}</p>
            <p className="text-xs text-ink-tertiary">{description}</p>
          </div>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-ink-tertiary transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Animated via CSS grid height technique */}
      <div className="accordion-panel" data-open={isOpen ? "true" : "false"} aria-hidden={!isOpen}>
        <div className="accordion-inner border-t border-white/[0.06]">{children}</div>
      </div>
    </div>
  );
}
