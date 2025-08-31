import React from "react"
import { loadModelCatalog, type ModelEntry, listProviders, hasTag, pricePer1k, type Safety } from "../config/models"
import Icon from "./Icon"

type Props = {
  value: string | null
  onChange: (id: string) => void
  allow?: string[] | null
  policyFromRole?: Safety | "any"
}
type SortKey = "alpha" | "price" | "context"

export default function ModelPicker({ value, onChange, allow = null, policyFromRole = "any" }: Props) {
  const [all, setAll] = React.useState<ModelEntry[]>([])
  const [ready, setReady] = React.useState(false)

  const [q, setQ] = React.useState("")
  const [provSel, setProvSel] = React.useState<string[]>([])
  const [freeOnly, setFreeOnly] = React.useState(false)
  const [visionOnly, setVisionOnly] = React.useState(false)
  const [minCtx, setMinCtx] = React.useState(0)
  const [maxPrice1k, setMaxPrice1k] = React.useState<number | null>(null)
  const [sort, setSort] = React.useState<SortKey>("alpha")
  const [policy, setPolicy] = React.useState<Safety | "any">("any")

  React.useEffect(() => {
    let alive = true
    ;(async () => {
      const list = await loadModelCatalog(false)
      if (!alive) return
      setAll(list); setReady(true)
    })()
    return () => { alive = false }
  }, [])

  React.useEffect(() => {
    if (policyFromRole !== "any") setPolicy(policyFromRole)
  }, [policyFromRole])

  const providers = React.useMemo(() => listProviders(all), [all])
  function toggleProv(p: string) { setProvSel((cur) => cur.includes(p) ? cur.filter(x => x !== p) : [...cur, p]) }

  const filtered = React.useMemo(() => {
    let list = all.slice()
    if (allow && allow.length > 0) list = list.filter(m => allow!.includes(m.id))
    if (q.trim()) {
      const term = q.trim().toLowerCase()
      list = list.filter(m => (m.id + " " + m.label).toLowerCase().includes(term))
    }
    if (provSel.length) list = list.filter(m => m.provider && provSel.includes(m.provider))
    if (freeOnly) list = list.filter(m => hasTag(m, "free"))
    if (visionOnly) list = list.filter(m => hasTag(m, "vision"))
    if (minCtx > 0) list = list.filter(m => (m.ctx ?? 0) >= minCtx)
    if (maxPrice1k !== null) {
      list = list.filter(m => {
        const p = pricePer1k(m.price)
        if (!p) return false
        return p.in <= maxPrice1k
      })
    }
    if (policy !== "any") list = list.filter(m => (m.safety ?? "moderate") === policy)

    list.sort((a,b) => {
      if (sort === "alpha") return a.label.localeCompare(b.label)
      if (sort === "context") return (b.ctx ?? 0) - (a.ctx ?? 0)
      if (sort === "price") {
        const ap = pricePer1k(a.price)?.in ?? Number.POSITIVE_INFINITY
        const bp = pricePer1k(b.price)?.in ?? Number.POSITIVE_INFINITY
        return ap - bp
      }
      return 0
    })
    return list
  }, [all, allow, q, provSel, freeOnly, visionOnly, minCtx, maxPrice1k, sort, policy])

  function Row({ m }: { m: ModelEntry }) {
    const active = value === m.id
    const p1k = pricePer1k(m.price)
    const policyLabel = m.safety === "strict" ? "strikte Policy" : m.safety === "loose" ? "lockere Policy" : "moderate Policy"
    return (
      <li className={`rounded-xl border px-3 py-2 transition ${active ? "border-blue-600 bg-blue-600/10" : "border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800/70"}`}>
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <div className="text-sm font-medium">{m.label}</div>
            <div className="text-xs opacity-70">
              <span className="inline-flex items-center gap-1"><Icon name="model" width="12" height="12" />{m.id}</span>
              {m.provider && <span className="ml-2">{m.provider}</span>}
              {typeof m.ctx === "number" && <span className="ml-2">Kontext: {m.ctx.toLocaleString()}</span>}
              {p1k && <span className="ml-2">~${p1k.in.toFixed(4)}/1k in</span>}
            </div>
            <div className="mt-1 flex flex-wrap gap-1">
              {m.tags.includes("free") && <Tag>free</Tag>}
              {m.tags.includes("vision") && <Tag>vision</Tag>}
              {m.tags.includes("large-context") && <Tag>large ctx</Tag>}
              {m.tags.includes("json") && <Tag>json</Tag>}
              {m.tags.includes("reasoning") && <Tag>reasoning</Tag>}
              <Tag>{policyLabel}</Tag>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onChange(m.id)}
            className={`px-3 py-1.5 rounded-xl border text-sm ${active ? "border-blue-600 bg-blue-600 text-white" : "border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800"}`}
            aria-pressed={active}
          >
            {active ? "Ausgewählt" : "Wählen"}
          </button>
        </div>
      </li>
    )
  }

  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/70 backdrop-blur p-3">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-end">
          <div className="lg:col-span-4">
            <label className="text-xs opacity-70 block mb-1">Suche</label>
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Modell oder Name…" className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline focus:outline-2 focus:outline-blue-500" />
          </div>
          <div className="lg:col-span-4">
            <label className="text-xs opacity-70 block mb-1">Provider</label>
            <div className="flex flex-wrap gap-2">
              {providers.map((p: string) => {
                const active = provSel.includes(p)
                return (
                  <button key={p} type="button" onClick={()=>toggleProv(p)} className={`px-3 py-1.5 rounded-full border text-sm ${active ? "border-blue-600 bg-blue-600 text-white" : "border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800"}`}>{p}</button>
                )
              })}
            </div>
          </div>
          <div className="lg:col-span-4">
            <label className="text-xs opacity-70 block mb-1">Sortierung</label>
            <div className="flex gap-2">
              <SortButton active={sort==="alpha"} onClick={()=>setSort("alpha")}>A–Z</SortButton>
              <SortButton active={sort==="price"} onClick={()=>setSort("price")}>Preis</SortButton>
              <SortButton active={sort==="context"} onClick={()=>setSort("context")}>Kontext</SortButton>
            </div>
          </div>

          <div className="lg:col-span-4">
            <label className="text-xs opacity-70 block mb-1">Kontextlänge (min)</label>
            <input type="number" min={0} step={1000} value={minCtx} onChange={e=>setMinCtx(parseInt(e.target.value||"0"))} className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline focus:outline-2 focus:outline-blue-500" />
          </div>
          <div className="lg:col-span-4">
            <label className="text-xs opacity-70 block mb-1">Max. Preis / 1k Tokens (Input)</label>
            <input type="number" min={0} step="0.0001" value={maxPrice1k ?? ""} placeholder="z.B. 0.0020" onChange={e=>setMaxPrice1k(e.target.value===""?null:parseFloat(e.target.value))} className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline focus:outline-2 focus:outline-blue-500" />
          </div>
          <div className="lg:col-span-4">
            <label className="text-xs opacity-70 block mb-1">Policy-Strenge</label>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={()=>setPolicy("any")} className={`px-3 py-1.5 rounded-full border text-sm ${policy==="any" ? "border-blue-600 bg-blue-600 text-white" : "border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800"}`}>Alle</button>
              <button type="button" onClick={()=>setPolicy("strict")} className={`px-3 py-1.5 rounded-full border text-sm ${policy==="strict" ? "border-blue-600 bg-blue-600 text-white" : "border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800"}`}>Strikt</button>
              <button type="button" onClick={()=>setPolicy("moderate")} className={`px-3 py-1.5 rounded-full border text-sm ${policy==="moderate" ? "border-blue-600 bg-blue-600 text-white" : "border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800"}`}>Mittel</button>
              <button type="button" onClick={()=>setPolicy("loose")} className={`px-3 py-1.5 rounded-full border text-sm ${policy==="loose" ? "border-blue-600 bg-blue-600 text-white" : "border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800"}`}>Locker</button>
            </div>
            <p className="mt-1 text-[11px] opacity-70">Heuristische Orientierung – kein Garant.</p>
          </div>

          <div className="lg:col-span-4 flex items-center gap-4">
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" checked={freeOnly} onChange={e=>setFreeOnly(e.target.checked)} />
              Kostenlos
            </label>
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" checked={visionOnly} onChange={e=>setVisionOnly(e.target.checked)} />
              Vision
            </label>
            <button type="button" onClick={() => { setQ(""); setProvSel([]); setFreeOnly(false); setVisionOnly(false); setMinCtx(0); setMaxPrice1k(null); setSort("alpha") }} className="ml-auto text-sm px-3 py-1.5 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800">
              Reset
            </button>
          </div>
        </div>
      </div>

      <ul className="space-y-2">
        {!ready && <li className="text-sm opacity-70">Lade Modelle…</li>}
        {ready && filtered.length === 0 && <li className="text-sm opacity-70">Keine Modelle gefunden.</li>}
        {filtered.map(m => <Row key={m.id} m={m} />)}
      </ul>
    </div>
  )
}

function SortButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} className={`px-3 py-1.5 rounded-full border text-sm ${active ? "border-blue-600 bg-blue-600 text-white" : "border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800"}`}>
      {children}
    </button>
  )
}

function Tag({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] border border-neutral-300 dark:border-neutral-700">{children}</span>
}
