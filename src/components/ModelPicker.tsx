import React from "react"
import { loadModelCatalog, type ModelEntry } from "../config/models"

type Props = {
  value: string | null
  onChange: (id: string) => void
  /** optional: empfohlene Policy aus Rolle für Hinweis/Filter */
  policyFromRole?: "any" | "strict" | "moderate" | "loose"
}

export default function ModelPicker({ value, onChange, policyFromRole = "any" }: Props) {
  const [all, setAll] = React.useState<ModelEntry[]>([])
  const [q, setQ] = React.useState("")
  const [freeOnly, setFreeOnly] = React.useState(false)
  const [largeCtx, setLargeCtx] = React.useState(false)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const list = await loadModelCatalog(false)
        if (!alive) return
        setAll(list)
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => { alive = false }
  }, [])

  function matches(m: ModelEntry): boolean {
    const qq = q.trim().toLowerCase()
    if (qq) {
      const hay =
        (m.label || "").toLowerCase() + " " +
        (m.id || "").toLowerCase() + " " +
        (m.provider || "").toLowerCase() + " " +
        (m.tags || []).join(" ").toLowerCase()
      if (!hay.includes(qq)) return false
    }
    if (freeOnly) {
      // Heuristik: Tag "free" vorhanden?
      if (!(m.tags || []).includes("free")) return false
    }
    if (largeCtx) {
      // Heuristik: Tag "large-context" vorhanden?
      if (!(m.tags || []).includes("large-context")) return false
    }
    if (policyFromRole !== "any") {
      // Wenn ein Model eine Safety besitzt, filtern; ansonsten als "moderate" behandeln.
      const safety = (m as any).safety ?? "moderate"
      if (safety !== policyFromRole) return false
    }
    return true
  }

  const list = all.filter(matches)

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Modell suchen…"
          className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-2"
        />
      </div>

      <div className="flex items-center gap-4 text-sm">
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={freeOnly} onChange={(e) => setFreeOnly(e.target.checked)} />
          Free
        </label>
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={largeCtx} onChange={(e) => setLargeCtx(e.target.checked)} />
          Large-Context
        </label>
        {policyFromRole !== "any" && (
          <span className="badge">Policy empfohlen: {policyFromRole}</span>
        )}
      </div>

      {loading && (
        <div className="text-sm opacity-70">Modelle werden geladen…</div>
      )}

      {!loading && list.length === 0 && (
        <div className="text-sm opacity-70">Keine Modelle gefunden.</div>
      )}

      <div className="grid gap-3">
        {list.map((m) => {
          const selected = value === m.id
          const safety = (m as any).safety ?? "moderate" // tolerant gegenüber fehlender Typangabe
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => onChange(m.id)}
              className={`model-card card text-left p-4 ${selected ? "ring-2" : ""}`}
              style={selected ? ({ boxShadow: "0 0 0 2px rgba(182,108,255,.8) inset" } as React.CSSProperties) : undefined}
            >
              <span
                className={
                  "policy-badge " +
                  (safety === "strict" ? "policy--strict" : safety === "loose" ? "policy--loose" : "policy--moderate")
                }
              >
                {safety}
              </span>

              <div className="flex items-start gap-3">
                <div className="shrink-0 rounded-lg border border-neutral-300 dark:border-neutral-700 px-2 py-1 text-[11px]">
                  {(m.provider || "").toLowerCase() || "model"}
                </div>
                <div className="flex-1">
                  <div className="card__title">{m.label || m.id}</div>
                  <div className="card__sub text-xs mt-0.5 break-all">{m.id}</div>
                  <div className="text-xs opacity-75 mt-2 flex flex-wrap gap-2">
                    {(m.tags || []).slice(0, 6).map((t) => (
                      <span key={t} className="inline-flex items-center px-2 py-0.5 rounded-full border border-neutral-300 dark:border-neutral-700">
                        {t}
                      </span>
                    ))}
                    {typeof m.ctx === "number" && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full border border-neutral-300 dark:border-neutral-700">
                        {m.ctx.toLocaleString()} tokens
                      </span>
                    )}
                  </div>
                </div>
                <div className="shrink-0">
                  <div className={`w-3 h-3 rounded-full ${selected ? "bg-violet-400" : "bg-neutral-500"}`} />
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
