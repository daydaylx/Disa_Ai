import { useEffect } from "react";

// Single theme system - minimal dark
const DATA_ATTRIBUTE = "data-ui-theme";

function applyTheme() {
  if (typeof document === "undefined") return;

  const root = document.documentElement;
  root.setAttribute(DATA_ATTRIBUTE, "minimal-dark");
  root.classList.add("dark");
  root.classList.remove("light");
}

export function useTheme() {
  useEffect(() => {
    applyTheme();
  }, []);

  // Simplified return for single theme
  return {
    mode: "minimal-dark" as const,
    effectiveMode: "minimal-dark" as const,
  };
}
