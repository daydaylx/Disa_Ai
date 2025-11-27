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
    <div className="rounded-xl bg-surface-1 border border-surface-2 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 bg-surface-2 hover:bg-surface-3 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5 text-brand" />
          <div className="text-left">
            <h3 className="font-semibold text-text-primary">{title}</h3>
            <p className="text-xs text-text-secondary">{description}</p>
          </div>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-text-secondary transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && children}
    </div>
  );
}
