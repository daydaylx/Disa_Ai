import React from "react"
import { loadModelCatalog, labelForModel, type ModelEntry } from "../config/models"

type Props = { value?: string | null; onChange?: (id: string) => void; className?: string }
type FilterState = { q: string; tags: { free: boolean; large: boolean } }

const RECENT_KEY = "disa:models:recent"

function loadRecent(): string[] { try { const raw = localStorage.getItem(RECENT_KEY); const arr = raw ? JSON.parse(raw) : []; return Array.isArray(arr) ? arr : [] } catch { return [] } }
function pushRecent(id: string) { try { const cur = loadRecent().filter((x) => x !== id); cur.unshift(id); const trimmed = cur.slice(0, 8); localStorage.setItem(RECENT_KEY, JSON.stringify(trimmed)) } catch {} }

export default function ModelPicker({ value, onChange, className }: Props) {
  const [busy, setBusy] = React.useState(true)
  const [models, setModels] = React.useState<ModelEntry[]>([])
  const [recent, setRecent] = React.useState<string[]>(loadRecent())
  const [f, setF] = React.useState<FilterState>({ q: "", tags: { free: false, large: false } })

  React.useEffect(() => {
    let alive = true
    ;(async () => { setBusy(true); try { const list = await loadModelCatalog(false); if (!alive) return; setModels(list) } finally { if (alive) setBusy(false) } })()
    return () => { alive = false }
  }, [])

  const filtered = React.useMemo(() => {
    let out = models.slice()
    const q = f.q.trim().toLowerCase()
    if (q) out = out.filter((m) => m.id.toLowerCase().includes(q) || m.label.toLowerCase().includes(q) || (m.provider ?? "").toLowerCase().includes(q))
    const tagFilters: string[] = []
    if (f.tags.free) tagFilters.push("free")
    if (f.tags.large) tagFilters.push("large-context")
    if (tagFilters.length > 0) out = out.filter((m) => tagFilters.every((t) => m.tags.includes(t)))
    return out
  }, [models, f])

  function select(id: string) { pushRecent(id); setRecent(loadRecent()); onChange?.(id) }

  return (
    <div className={className}>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <label className="sr-only" htmlFor="model-search">Modell suchen</label>
        <input
          id="model-search"
          value={f.q}
          onChange={(e) => setF((s) => ({ ...s, q: e.target.value }))}
          placeholder="Modell suchen…"
          aria-label="Nach Modell suchen"
          className="px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm w-full md:w-80 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-blue-500"
        />
        <label className="flex items-center gap-2 text-sm select-none">
          <input type="checkbox" checked={f.tags.free} onChange={(e) => setF((s) => ({ ...s, tags: { ...s.tags, free: e.target.checked } }))} aria-label="Nur kostenlose Modelle anzeigen" />
          Free
        </label>
        <label className="flex items-center gap-2 text-sm select-none">
          <input type="checkbox" checked={f.tags.large} onChange={(e) => setF((s) => ({ ...s, tags: { ...s.tags, large: e.target.checked } }))} aria-label="Nur Modelle mit großem Kontext anzeigen" />
          Large-Context
        </label>
      </div>

      {recent.length > 0 && (
        <div className="mb-4">
          <div className="text-xs uppercase tracking-wide text-neutral-500 mb-2">Kürzlich</div>
          <div className="flex flex-wrap gap-2">
            {recent.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => select(id)}
                className={`px-2.5 py-1.5 rounded border text-xs focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 ${value === id ? "border-neutral-900 dark:border-neutral-200" : "border-neutral-300 dark:border-neutral-700"}`}
                title={id}
                aria-pressed={value === id}
                aria-label={`Modell ${labelForModel(id)} auswählen`}
              >
                {labelForModel(id)}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {busy && <div className="text-sm opacity-70">Lade Modelle…</div>}
        {!busy && filtered.length === 0 && <div className="text-sm opacity-70">Keine Modelle gefunden.</div>}
        {filtered.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => select(m.id)}
            className={`text-left rounded-lg border p-3 hover:shadow transition focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 ${value === m.id ? "border-neutral-900 dark:border-neutral-200" : "border-neutral-300 dark:border-neutral-700"}`}
            title={m.id}
            aria-pressed={value === m.id}
            aria-label={`Modell ${m.label} auswählen`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-medium">{m.label}</div>
                <div className="text-xs opacity-70">{m.provider ?? "—"}</div>
              </div>
              <div className="flex gap-1">
                {m.tags.map((t) => (<span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-200/70 dark:bg-neutral-800/70">{t}</span>))}
              </div>
            </div>
            <div className="mt-2 text-xs grid grid-cols-2 gap-x-4 gap-y-1">
              <div className="opacity-70">Kontext</div>
              <div>{m.ctx ? `${m.ctx.toLocaleString()} tokens` : "—"}</div>
              <div className="opacity-70">Preis In/Out</div>
              <div>{m.price ? `${m.price.in}/${m.price.out} $/1k` : "—"}</div>
            </div>
            {value === m.id && <div className="mt-2 text-xs text-emerald-700 dark:text-emerald-400">Ausgewählt</div>}
          </button>
        ))}
      </div>
    </div>
  )
}
