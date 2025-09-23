import { useCallback, useEffect, useMemo, useState } from "react";

export type ThemeMode = "dark" | "light" | "auto" | "dark-glass";

const STORAGE_KEY = "disa:theme:mode";
const DATA_ATTRIBUTE = "data-ui-theme";

function resolveSystemPreference(): "dark" | "light" {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(mode: ThemeMode) {
  if (typeof document === "undefined") return;

  const root = document.documentElement;
  const effective = mode === "auto" ? resolveSystemPreference() : mode;

  root.setAttribute(DATA_ATTRIBUTE, effective);
  root.classList.toggle("dark", effective === "dark" || effective === "dark-glass");
  root.classList.toggle("light", effective === "light");
}

export function useTheme() {
  const [mode, setMode] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") return "dark-glass";
    const stored = window.localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    return stored ?? "dark-glass";
  });

  const effectiveMode = useMemo(() => {
    return mode === "auto" ? resolveSystemPreference() : mode;
  }, [mode]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // ignore storage errors
    }
    applyTheme(mode);
  }, [mode]);

  useEffect(() => {
    if (mode !== "auto" || typeof window === "undefined") return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applyTheme("auto");

    handler();
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, [mode]);

  const setThemeMode = useCallback((next: ThemeMode) => {
    setMode(next);
  }, []);

  return {
    mode,
    effectiveMode,
    setMode: setThemeMode,
    availableModes: ["dark-glass", "dark", "light", "auto"] as const,
  };
}
