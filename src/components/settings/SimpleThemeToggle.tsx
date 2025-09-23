import * as React from "react";

import { type ThemeMode, useTheme } from "../../hooks/useTheme";
import { Button } from "../ui/Button";

interface SimpleThemeToggleProps {
  className?: string;
}

const MODES: ThemeMode[] = ["dark-glass", "dark", "light", "auto"];

export default function SimpleThemeToggle({ className = "" }: SimpleThemeToggleProps) {
  const { mode, setMode, effectiveMode } = useTheme();

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-lg font-semibold text-text-primary">Theme</h3>
      <div className="flex flex-wrap gap-2">
        {MODES.map((option) => (
          <Button
            key={option}
            variant={mode === option ? "primary" : "ghost"}
            size="sm"
            onClick={() => setMode(option)}
          >
            {option === "auto"
              ? "Auto"
              : option === "dark"
                ? "Dunkel"
                : option === "light"
                  ? "Hell"
                  : "Dark Glass"}
          </Button>
        ))}
      </div>
      <p className="text-sm text-text-muted/85">
        {mode === "auto"
          ? `Theme folgt den Systemeinstellungen (${effectiveMode === "dark" ? "Dunkel" : "Hell"})`
          : mode === "dark-glass"
            ? "Dark Glass aktiv"
            : `Aktueller Theme: ${mode === "dark" ? "Dunkel" : "Hell"}`}
      </p>
    </div>
  );
}
