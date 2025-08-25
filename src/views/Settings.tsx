import React from "react"
import ModelPicker from "../components/ModelPicker"
import InlineBanner from "../components/InlineBanner"
import Icon from "../components/Icon"
import Switch from "../components/Switch"
import PillSelect from "../components/PillSelect"
import SectionCard from "../components/SectionCard"
import StickyActions from "../components/StickyActions"
import { setApiKey, getApiKey } from "../services/openrouter"
import { getSelectedModelId, setSelectedModelId, getNSFW, setNSFW, getStyle, setStyle, type StyleKey, getTemplateId, setTemplateId, getUseRoleStyle, setUseRoleStyle } from "../config/settings"
import { listRoleTemplates, getRoleById } from "../config/promptTemplates"
import { generateRoleStyleText } from "../config/styleEngine"

const STYLE_OPTIONS: { value: StyleKey; label: string }[] = [
  { value: "blunt_de", label: "Direkt & kritisch" },
  { value: "neutral", label: "Neutral" },
  { value: "concise", label: "Sehr knapp" },
  { value: "friendly", label: "Freundlich" },
  { value: "creative_light", label: "Bildhaft" },
  { value: "minimal", label: "Nur Antwort" }
]

export default function SettingsView() {
  const [key, setKey] = React.useState<string>(getApiKey() ?? "")
  const [modelId, setModelId] = React.useState<string | null>(getSelectedModelId())
  const [nsfw, setNsfw] = React.useState<boolean>(getNSFW())
  const [style, setStyleState] = React.useState<StyleKey>(getStyle())
  const [templateId, setTemplateIdState] = React.useState<string | null>(getTemplateId())
  const [useRoleStyle, setUseRoleStyleState] = React.useState<boolean>(getUseRoleStyle())
  const templates = React.useMemo(() => listRoleTemplates(), [])
  const currentRole = React.useMemo(() => getRoleById(templateId), [templateId])
  const hasKey = !!(getApiKey() ?? "")
  const [savedToast, setSavedToast] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!savedToast) return
    const t = window.setTimeout(() => setSavedToast(null), 1200)
    return () => window.clearTimeout(t)
  }, [savedToast])

  function saveKey() { setApiKey(key.trim()); setSavedToast("Key gespeichert") }
  function clearKey() { setKey(""); setApiKey(""); setSavedToast("Key gelöscht") }
  function onChoose(id: string) { setModelId(id); setSelectedModelId(id); setSavedToast("Modell geändert") }

  function toggleNSFW() { const next = !nsfw; setNsfw(next); setNSFW(next) }

  function clearAll() {
    if (!confirm("Wirklich alle lokalen Daten löschen? Chats, Einstellungen, Key.")) return
    try {
      const toRemove: string[] = []
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i)
        if (!k) continue
        if (k.startsWith("disa:")) toRemove.push(k)
      }
      toRemove.forEach(k => localStorage.removeItem(k))
      sessionStorage.removeItem("disa:modelCatalog:v2")
      setKey("")
      setSavedToast("Alles gelöscht")
    } catch {}
  }

  const roleStyleText = React.useMemo(() => generateRoleStyleText(currentRole?.id ?? null, style, useRoleStyle), [currentRole?.id, style, useRoleStyle])

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
      <h1 className="text-xl font-semibold">Einstellungen</h1>

      <StickyActions nsfw={nsfw} onToggleNSFW={toggleNSFW} onClearAll={clearAll} />

      {!hasKey && (
        <InlineBanner tone="warn" title="Kein OpenRouter API-Key gespeichert.">Ohne Key kann nicht gechattet werden.</InlineBanner>
      )}

      {savedToast && (
        <div className="fixed left-1/2 -translate-x-1/2 top-[60px] z-20">
          <div className="rounded-full px-3 py-1.5 text-sm border border-white/30 dark:border-white/10 bg-white/65 dark:bg-neutral-900/55 backdrop-blur shadow-sm inline-flex items-center gap-2">
            <Icon name="check" width="14" height="14" />
            <span>{savedToast}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SectionCard title="API-Key" icon="key" subtitle="Wird lokal gespeichert." variant="glass" accent="purple">
          <div className="flex flex-col gap-2">
            <label className="sr-only" htmlFor="api-key">OpenRouter API-Key</label>
            <input
              id="api-key"
              type="password"
              autoComplete="off"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="sk-or-…"
              aria-describedby="api-key-help"
              className="px-3 py-2 rounded-xl border border-neutral-300/80 dark:border-neutral-700/80 bg-white/80 dark:bg-neutral-950/40 focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-neutral-900 transition"
            />
            <div className="flex gap-2">
              <button type="button" onClick={saveKey} className="px-3 py-2 rounded-xl border border-blue-600 bg-blue-600 text-white hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:ring-offset-2 transition">Speichern</button>
              <button type="button" onClick={clearKey} className="px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100/60 dark:hover:bg-neutral-800/60 focus:outline-none focus:ring-2 focus:ring-neutral-400/50 focus:ring-offset-2 transition">Löschen</button>
            </div>
            <p id="api-key-help" className="text-xs opacity-70 mt-1 inline-flex items-center gap-1"><Icon name="shield" width="14" height="14" /> Lokal, kein Server-Upload.</p>
          </div>
        </SectionCard>

        <SectionCard title="Inhalte" icon="nsfw" subtitle="Steuert sensible Themen und Schreibstil." variant="glass" accent="blue">
          <div className="space-y-4">
            <Switch id="nsfw" checked={nsfw} onChange={(v) => { setNsfw(v); setNSFW(v) }} label="NSFW (18+) erlauben" />
            <div className="space-y-2">
              <div className="text-sm font-medium inline-flex items-center gap-2"><Icon name="style" width="16" height="16" />Antwort-Stil</div>
              <PillSelect value={style} options={STYLE_OPTIONS} onChange={(v) => { setStyleState(v as StyleKey); setStyle(v as StyleKey) }} />
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Rolle" icon="role" subtitle="Optionales System-Verhalten für den Chat." variant="glass" accent="pink">
          <div className="space-y-3">
            <select
              value={templateId ?? ""}
              onChange={(e) => { const val = e.target.value || null; setTemplateIdState(val); setTemplateId(val) }}
              className="w-full px-3 py-2 rounded-xl border border-neutral-300/80 dark:border-neutral-700/80 bg-white/80 dark:bg-neutral-950/40 focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:ring-offset-2 transition"
            >
              <option value="">Keine Rolle</option>
              {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
            <Switch id="use-role-style" checked={useRoleStyle} onChange={(v) => { setUseRoleStyleState(v); setUseRoleStyle(v) }} label="Stil an Rolle anpassen" />
            <div className="rounded-xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-neutral-950/40 backdrop-blur p-3">
              <div className="text-xs opacity-60 mb-1">Vorschau</div>
              <pre className="text-xs whitespace-pre-wrap leading-relaxed">{roleStyleText}</pre>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Modell" icon="model" subtitle="Wähle das Sprachmodell für den Chat." variant="glass" accent="green">
          <div className="space-y-2">
            <ModelPicker value={modelId} onChange={(id) => { setModelId(id); setSelectedModelId(id) }} />
            <p className="text-xs opacity-70">Einige Rollen erfordern spezifische Modelle. Bei Konflikt wird automatisch umgeschaltet.</p>
          </div>
        </SectionCard>
      </div>
    </div>
  )
}
