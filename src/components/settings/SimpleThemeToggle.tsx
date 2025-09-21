import * as React from "react";

import { Button } from "../ui/Button";

type ThemeMode = "dark" | "light" | "auto";

interface SimpleThemeToggleProps {
  className?: string;
}

export default function SimpleThemeToggle({ className = "" }: SimpleThemeToggleProps) {
  const [themeMode, setThemeMode] = React.useState<ThemeMode>(() => {
    return (localStorage.getItem("theme-mode") as ThemeMode) || "dark";
  });

  const applyTheme = React.useCallback((mode: ThemeMode) => {
    localStorage.setItem("theme-mode", mode);
    setThemeMode(mode);

    if (mode === "auto") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.classList.toggle("dark", prefersDark);
      document.documentElement.classList.toggle("light", !prefersDark);
    } else {
      document.documentElement.classList.toggle("dark", mode === "dark");
      document.documentElement.classList.toggle("light", mode === "light");
    }
  }, []);

  // Auto theme handling
  React.useEffect(() => {
    if (themeMode === "auto") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => {
        document.documentElement.classList.toggle("dark", mediaQuery.matches);
        document.documentElement.classList.toggle("light", !mediaQuery.matches);
      };

      mediaQuery.addEventListener("change", handleChange);
      handleChange(); // Apply initial

      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [themeMode]);

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-lg font-semibold">Theme</h3>
      <div className="flex gap-2">
        {(["dark", "light", "auto"] as const).map((mode) => (
          <Button
            key={mode}
            variant={themeMode === mode ? "primary" : "ghost"}
            size="sm"
            onClick={() => applyTheme(mode)}
          >
            {mode === "auto" ? "Auto" : mode === "dark" ? "Dunkel" : "Hell"}
          </Button>
        ))}
      </div>
      <p className="text-sm text-text-secondary">
        {themeMode === "auto"
          ? "Theme folgt den Systemeinstellungen"
          : `Aktueller Theme: ${themeMode === "dark" ? "Dunkel" : "Hell"}`}
      </p>
    </div>
  );
}
