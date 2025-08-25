import React from "react"
import ModelPicker from "../components/ModelPicker"
import InlineBanner from "../components/InlineBanner"
import { setApiKey, getApiKey } from "../services/openrouter"
import { getSelectedModelId, setSelectedModelId, getNSFW, setNSFW, getStyle, setStyle, type StyleKey } from "../config/settings"

const STYLE_OPTIONS: { value: StyleKey; label: string }[] = [
  { value: "blunt_de", label: "Direkt & kritisch (empfohlen)" },
  { value: "neutral", label: "Neutral" },
  { value: "concise", label: "Sehr knapp" },
  { value: "friendly", label: "Freundlich" },
  { value: "creative_light", label: "Etwas bildhaft" },
  { value: "minimal", label: "Nur Antwort" }
]

export default function SettingsView() {
  const [key, setKey] = React.useState<string>(getApiKey() ?? "")
  const [modelId, setModelId] = React.useState<string | null>(getSelectedModelId())
  const [nsfw, setNsfw] = React.useState<boolean>(getNSFW())
  const [style, setStyleState] = React.useState<StyleKey>(getStyle())

  function saveKey() { setApiKey(key.trim()) }
  function clearKey() { setKey(""); setApiKey("") }
  function onChoose(id: string) { setModelId(id); setSelectedModelId(id) }
  function onToggleNSFW(e: React.ChangeEvent<HTMLInputElement>) { setNsfw(e.target.checked); setNSFW(e.target.checked) }
  function onStyleChange(e: React.ChangeEvent<HTMLSelectElement>) { const val = e.target.value as StyleKey; setStyleState(val); setStyle(val) }

  const hasKey = !!(getApiKey() ?? "")

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      {!hasKey && (<InlineBanner tone="warn" title="Kein OpenRouter API-Key gespeichert.">Ohne Key kann nicht gechattet werden.</InlineBanner>)}

      <section className="mt-4">
        <h2 className="text-lg font-semibold mb-2">API-Key</h2>
        <div className="flex flex-col md:flex-row gap-2">
          <label className="sr-only" htmlFor="api-key">OpenRouter API-Key</label>
          <input
            id="api-key"
            type="password"
            autoComplete="off"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="sk-or-…"
            aria-describedby="api-key-help"
            className="px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 w-full md:w-96 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-blue-500"
          />
          <div className="flex gap-2">
            <button type="button" onClick={saveKey} className="px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-blue-500">Speichern</button>
            <button type="button" onClick={clearKey} className="px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-blue-500">Löschen</button>
          </div>
        </div>
        <p id="api-key-help" className="text-xs opacity-70 mt-1">Wird nur lokal gespeichert.</p>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold mb-2">Inhalts-Einstellungen</h2>
        <div className="flex flex-col md:flex-row gap-4 md:items-center">
          <label className="flex items-center gap-2 select-none">
            <input type="checkbox" checked={nsfw} onChange={onToggleNSFW} aria-label="NSFW Inhalte erlauben (18+)" />
            NSFW (18+) erlauben
          </label>
          <div className="text-xs opacity-70">Erlaubt erwachsene Themen (legal, providerabhängig). Tabus: Minderjährige, Zwang, illegale Inhalte.</div>
        </div>
        <div className="mt-4">
          <label className="block text-sm mb-1" htmlFor="style-select">Antwort-Stil</label>
          <select
            id="style-select"
            value={style}
            onChange={onStyleChange}
            className="px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-blue-500"
          >
            {STYLE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold mb-2">Modell auswählen</h2>
        <ModelPicker value={modelId} onChange={onChoose} />
      </section>
    </div>
  )
}
