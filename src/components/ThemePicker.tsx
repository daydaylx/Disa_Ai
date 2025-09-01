import React from "react"
import { getThemePreset, setThemePreset, type ThemePreset, getDensity, setDensity, type Density } from "../config/theme"

const PRESETS: { id: ThemePreset; label: string }[] = [
  { id: "orchid", label: "Orchid" },
  { id: "ocean", label: "Ocean" },
  { id: "forest", label: "Forest" },
  { id: "cyber", label: "Cyber" },
  { id: "graphite", label: "Graphite" },
]

export default function ThemePicker() {
  const [preset, setPreset] = React.useState<ThemePreset>(getThemePreset())
  const [density, setDen] = React.useState<Density>(getDensity())
  function choose(p: ThemePreset) { setPreset(p); setThemePreset(p) }
  function chooseDensity(d: Density) { setDen(d); setDensity(d) }
  return (
    <div className="space-y-3">
      <div>
        <div className="text-sm font-medium mb-2">Farbschema</div>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map(p => (
            <button key={p.id} onClick={() => choose(p.id)}
              className={`px-3 py-1.5 rounded-xl border text-sm ${preset===p.id ? "border-blue-600 bg-blue-600 text-white" : "border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800"}`}>
              {p.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <div className="text-sm font-medium mb-2">Dichte</div>
        <div className="flex gap-2">
          <button onClick={()=>chooseDensity("comfortable")}
            className={`px-3 py-1.5 rounded-xl border text-sm ${density==="comfortable" ? "border-blue-600 bg-blue-600 text-white" : "border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800"}`}>Komfort</button>
          <button onClick={()=>chooseDensity("compact")}
            className={`px-3 py-1.5 rounded-xl border text-sm ${density==="compact" ? "border-blue-600 bg-blue-600 text-white" : "border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800"}`}>Kompakt</button>
        </div>
      </div>
    </div>
  )
}
