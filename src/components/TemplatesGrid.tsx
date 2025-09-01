import React, { useMemo, useState } from "react"
import { TEMPLATES, setActiveTemplate, setDefaultTemplate } from "../state/templates"
import type { TemplateMeta, TemplateCategory } from "../state/templates"
import { requestChatFocus, requestNewChatSession } from "../utils/focusChatInput"

const CATS: { key: TemplateCategory | "all"; label: string }[] = [
  { key: "all", label: "Alle" },
  { key: "dev", label: "Dev" },
  { key: "business", label: "Business" },
  { key: "alltag", label: "Alltag" },
  { key: "gesundheit", label: "Gesundheit" },
  { key: "kreativ", label: "Kreativ" },
  { key: "leer", label: "Leerer Chat" },
]

export default function TemplatesGrid() {
  const [q, setQ] = useState("")
  const [cat, setCat] = useState<TemplateCategory | "all">("all")

  const list = useMemo(() => {
    const norm = q.trim().toLowerCase()
    return TEMPLATES.filter(t =>
      (cat === "all" || t.category === cat) &&
      (
        norm === "" ||
        t.title.toLowerCase().includes(norm) ||
        t.tags.some(tag => tag.toLowerCase().includes(norm))
      )
    )
  }, [q, cat])

  const useTemplate = (tpl: TemplateMeta) => {
    setActiveTemplate(tpl.id)
    window.location.hash = "/chat"
    requestNewChatSession({ templateId: tpl.id })
    requestChatFocus()
  }

  const setAsDefault = (tpl: TemplateMeta) => {
    setDefaultTemplate(tpl.id)
    alert(`"${tpl.title}" als Standard gesetzt.`)
  }

  return (
    <section className="mt-6 space-y-4">
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {CATS.map(c => (
          <button
            key={c.key}
            onClick={() => setCat(c.key as any)}
            className={`px-3 py-1 rounded-xl border text-sm whitespace-nowrap ${
              cat === c.key ? "border-white/40 bg-white/10" : "border-white/10 bg-white/5"
            } active:scale-[0.98]`}
          >
            {c.label}
          </button>
        ))}
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Suche (Titel/Tags)…"
          className="ml-auto w-full max-w-[220px] rounded-xl px-3 py-1 bg-white/5 border border-white/10 text-sm"
          aria-label="Vorlagen durchsuchen"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {list.slice(0, 10).map(tpl => (
          <article
            key={tpl.id}
            className="rounded-2xl border border-white/10 bg-white/5 p-4 flex flex-col gap-2 hover:border-white/20"
          >
            <header className="flex items-center justify-between gap-2">
              <h3 className="font-medium">{tpl.title}</h3>
              <button
                onClick={() => setAsDefault(tpl)}
                className="text-xs opacity-75 hover:opacity-100 underline underline-offset-2"
                title="Als Standard verwenden"
              >
                Standard
              </button>
            </header>

            <p className="text-sm opacity-80">{tpl.purpose}</p>

            <div className="flex flex-wrap gap-1">
              {tpl.tags.map(tag => (
                <span
                  key={tag}
                  className="text-[11px] px-2 py-0.5 rounded-full bg-white/10 border border-white/10"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-2">
              <button
                onClick={() => useTemplate(tpl)}
                className="w-full rounded-xl px-3 py-2 bg-white/10 border border-white/10 active:scale-[0.98]"
                aria-label={`Vorlage ${tpl.title} verwenden`}
              >
                Verwenden
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
