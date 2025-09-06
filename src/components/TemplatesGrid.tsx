import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import type { TemplateCategory, TemplateMeta } from "../state/templates";
import { setActiveTemplate, setDefaultTemplate, TEMPLATES } from "../state/templates";
import { requestChatFocus, requestNewChatSession } from "../utils/focusChatInput";

const CATS: { key: TemplateCategory | "all"; label: string }[] = [
  { key: "all", label: "Alle" },
  { key: "dev", label: "Dev" },
  { key: "business", label: "Business" },
  { key: "alltag", label: "Alltag" },
  { key: "gesundheit", label: "Gesundheit" },
  { key: "kreativ", label: "Kreativ" },
  { key: "leer", label: "Leerer Chat" },
];

export default function TemplatesGrid() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<TemplateCategory | "all">("all");
  const navigate = useNavigate();

  const list = useMemo(() => {
    const norm = q.trim().toLowerCase();
    return TEMPLATES.filter(
      (t) =>
        (cat === "all" || t.category === cat) &&
        (norm === "" ||
          t.title.toLowerCase().includes(norm) ||
          t.tags.some((tag) => tag.toLowerCase().includes(norm))),
    );
  }, [q, cat]);

  const useTemplate = (tpl: TemplateMeta) => {
    setActiveTemplate(tpl.id);
    navigate("/chat");
    requestNewChatSession({ templateId: tpl.id });
    requestChatFocus();
  };

  return (
    <section className="mt-8 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto">
          {CATS.map((c) => (
            <button
              key={c.key}
              onClick={() => setCat(c.key as any)}
              className={`rounded-full border px-3 py-1.5 text-sm ${cat === c.key ? "border-white/40 bg-white/10" : "border-white/10 bg-white/5 hover:bg-white/10"}`}
            >
              {c.label}
            </button>
          ))}
        </div>
        <input
          className="rounded-md border border-white/10 bg-white/10 px-3 py-1.5 outline-none"
          placeholder="Suchen…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {list.map((tpl) => (
          <article key={tpl.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-semibold">{tpl.title}</div>
                <div className="text-sm opacity-80">{tpl.purpose}</div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {tpl.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-white/10 px-2 py-0.5 text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={() => setDefaultTemplate(tpl.id)}
                className="text-xs underline opacity-70"
              >
                als Standard
              </button>
            </div>
            <div className="mt-3">
              <button
 
    // eslint-disable-next-line react-hooks/rules-of-hooks
                onClick={() => useTemplate(tpl)}
                className="w-full rounded-xl border border-white/10 bg-white/10 px-3 py-2 active:scale-[0.98]"
                aria-label={`Vorlage ${tpl.title} verwenden`}
              >
                Verwenden
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
