import { useEffect } from "react";

// Single theme system - always dark-glass
const DATA_ATTRIBUTE = "data-ui-theme";

function applyTheme() {
  if (typeof document === "undefined") return;

  const root = document.documentElement;
  root.setAttribute(DATA_ATTRIBUTE, "dark-glass");
  root.classList.add("dark");
  root.classList.remove("light");
}

export function useTheme() {
  useEffect(() => {
    applyTheme();
  }, []);

  // Simplified return for single theme
  return {
    mode: "dark-glass" as const,
    effectiveMode: "dark-glass" as const,
  };
}
