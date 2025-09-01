const LS_THEME = "disa:theme:preset"
const LS_DENSITY = "disa:theme:density"
const LS_MODE = "disa:theme:mode"

export type ThemePreset = "orchid" | "ocean" | "forest" | "cyber" | "graphite"
export type Density = "comfortable" | "compact"

/** Für Kompatibilität mit TopBar: früherer Theme-Mode (System/Light/Dark). */
export type ThemeMode = "system" | "light" | "dark"

/* ---------- Preset (Farbschema) ---------- */
export function getThemePreset(): ThemePreset {
  try { return (localStorage.getItem(LS_THEME) as ThemePreset) || "orchid" } catch { return "orchid" }
}
export function setThemePreset(p: ThemePreset) {
  try { localStorage.setItem(LS_THEME, p) } catch {}
  try { document.documentElement.setAttribute("data-theme", p) } catch {}
}

/* ---------- Dichte ---------- */
export function getDensity(): Density {
  try { return (localStorage.getItem(LS_DENSITY) as Density) || "comfortable" } catch { return "comfortable" }
}
export function setDensity(d: Density) { try { localStorage.setItem(LS_DENSITY, d) } catch {} }

/* ---------- Mode (System/Light/Dark) – Kompatibilität zu alter TopBar ---------- */
export function getTheme(): ThemeMode {
  try { return (localStorage.getItem(LS_MODE) as ThemeMode) || "system" } catch { return "system" }
}
export function setTheme(m: ThemeMode) {
  try { localStorage.setItem(LS_MODE, m) } catch {}
  applyTheme(m)
}

/** Aktiviert die passende Dark/Light-Class – belässt das Farbpreset auf data-theme. */
export function applyTheme(mode?: ThemeMode) {
  try { console.log("__THEME", { preset: getThemePreset(), mode: mode ?? getTheme() }); } catch {}

  const m = mode ?? getTheme()
  let effective: "light" | "dark"
  if (m === "system") {
    try {
      effective = (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) ? "dark" : "light"
    } catch { effective = "dark" }
  } else {
    effective = m
  }
  try {
    const root = document.documentElement
    root.classList.toggle("dark", effective === "dark")
    // Preset sicherstellen (falls extern noch nicht gesetzt)
    const cur = getThemePreset()
    root.setAttribute("data-theme", cur)
  } catch {}
}

/* ---------- Init ---------- */
export function initTheme() {
  setThemePreset(getThemePreset())
  applyTheme(getTheme())
}
