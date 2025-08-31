export type ThemeMode = "light" | "dark";
const THEME_KEY = "disa:theme";

export function getTheme(): ThemeMode {
  try {
    const v = localStorage.getItem(THEME_KEY) as ThemeMode | null;
    return v ?? "dark";
  } catch {
    return "dark";
  }
}

export function setTheme(mode: ThemeMode) {
  try {
    localStorage.setItem(THEME_KEY, mode);
  } catch {}
  applyTheme(mode);
}

export function applyTheme(mode?: ThemeMode) {
  const m = mode ?? getTheme();
  const root = document.documentElement;
  if (m === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
}
