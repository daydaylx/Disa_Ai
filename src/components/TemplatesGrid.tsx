import React, { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { TEMPLATES, setActiveTemplate, setDefaultTemplate } from "../state/templates"
import type { TemplateMeta, TemplateCategory } from "../state/templates"
import { requestNewChatSession, requestChatFocus } from "../utils/focusChatInput"

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
  const navigate = useNavigate()

  const list = useMemo(() => {
    const norm = q.trim().toLowerCase()
    return TEMPLATES.filter(t =>
      (cat === "all" || t.category === cat) &&
      (norm === "" || t.title.toLowerCase().includes(norm) || t.tags.some(tag => tag.toLowerCase().includes(norm)))
    )
  }, [q, cat])

  const useTemplate = (tpl: TemplateMeta) => {
    setActiveTemplate(tpl.id)
    navigate("/chat")
    requestNewChatSession({ templateId: tpl.id })
    requestChatFocus()
  }

  return (
    <section className="mt-8 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto">
          {CATS.map(c => (
            <button key={c.key}
              onClick={()=>setCat(c.key as any)}
              className={`px-3 py-1.5 rounded-full text-sm border ${cat===c.key ? 'border-white/40 bg-white/10' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}>
              {c.label}
            </button>
          ))}
        </div>
        <input className="px-3 py-1.5 rounded-md bg-white/10 border border-white/10 outline-none"
               placeholder="Suchen…" value={q} onChange={(e)=>setQ(e.target.value)} />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {list.map(tpl => (
          <article key={tpl.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-semibold">{tpl.title}</div>
                <div className="text-sm opacity-80">{tpl.purpose}</div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {tpl.tags.map(tag => <span key={tag} className="px-2 py-0.5 rounded-full text-xs bg-white/10">{tag}</span>)}
                </div>
              </div>
              <button onClick={() => setDefaultTemplate(tpl.id)} className="text-xs opacity-70 underline">als Standard</button>
            </div>
            <div className="mt-3">
              <button onClick={() => useTemplate(tpl)}
                className="w-full rounded-xl px-3 py-2 bg-white/10 border border-white/10 active:scale-[0.98]"
                aria-label={`Vorlage ${tpl.title} verwenden`}>Verwenden</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
