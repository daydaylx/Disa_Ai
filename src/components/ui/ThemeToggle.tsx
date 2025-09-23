import * as React from "react";

import { type ThemeMode, useTheme } from "../../hooks/useTheme";
import { cn } from "../../lib/utils/cn";

interface ThemeOption {
  value: ThemeMode;
  label: string;
  description: string;
  icon: string;
}

const OPTIONS: ThemeOption[] = [
  {
    value: "dark-glass",
    label: "Dark Glass",
    description: "Transparente Panels mit Teal & Violett",
    icon: "",
  },
  {
    value: "dark",
    label: "Dark",
    description: "Klassische dunkle Oberfläche",
    icon: "",
  },
  {
    value: "light",
    label: "Light",
    description: "Helle Oberfläche",
    icon: "",
  },
  {
    value: "auto",
    label: "System",
    description: "Folgt der Betriebssystem-Einstellung",
    icon: "",
  },
];

function describeMode(mode: ThemeMode, effective: ThemeMode) {
  if (mode === "auto") {
    return `System (${effective === "dark" ? "Dunkel" : "Hell"})`;
  }
  const match = OPTIONS.find((option) => option.value === mode);
  return match ? match.label : mode;
}

export interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { mode, setMode, effectiveMode } = useTheme();
  const currentLabel = describeMode(mode, effectiveMode);

  return (
    <section className={cn("space-y-4", className)} aria-label="Theme-Auswahl">
      <header className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-text-primary">UI Theme</h3>
          <p className="text-xs text-text-muted/85">Aktuell: {currentLabel}</p>
        </div>
        <span className="bg-glass-surface/12 rounded-full border border-glass-border/30 px-3 py-1 text-xs text-text-secondary/90">
          {currentLabel}
        </span>
      </header>

      <div className="grid gap-2 sm:grid-cols-2">
        {OPTIONS.map((option) => {
          const isActive = mode === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setMode(option.value)}
              className={cn(
                "flex items-center justify-between rounded-xl border px-3 py-3 text-left text-sm transition-colors",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-violet/40 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
                isActive
                  ? "bg-accent-teal/18 border-accent-teal/55 text-text-primary"
                  : "hover:bg-glass-surface/16 border-glass-border/25 bg-glass-surface/10 text-text-secondary/90",
              )}
              aria-pressed={isActive}
            >
              <div className="flex flex-col gap-1">
                <span className="font-medium">{option.label}</span>
                <span className="text-xs text-text-muted/85">{option.description}</span>
              </div>
              {isActive ? (
                <span className="text-accent-teal">✓</span>
              ) : (
                <span className="text-text-muted/60">•</span>
              )}
            </button>
          );
        })}
      </div>

      {mode === "dark-glass" && (
        <p className="text-xs text-text-muted/75">
          Dark Glass betont Glasflächen, sanfte Schatten und klare Kontraste für gute Lesbarkeit.
        </p>
      )}
      {mode === "auto" && (
        <p className="text-xs text-text-muted/75">
          Der Modus wechselt automatisch zwischen Hell und Dunkel entsprechend deiner
          Systemeinstellung.
        </p>
      )}
    </section>
  );
}
