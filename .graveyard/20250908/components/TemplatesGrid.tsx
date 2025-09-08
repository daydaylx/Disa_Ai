import React, { useMemo, useState } from "react";

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

  const applyTemplate = (tpl: TemplateMeta) => {
    setActiveTemplate(tpl.id);
    try {
      if (location.hash !== "#/chat") location.hash = "#/chat";
    } catch (e) {
      void e;
      /* ignore */
    }
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
              className={`nav-pill ${cat === c.key ? "nav-pill--active" : ""}`}
            >
              {c.label}
            </button>
          ))}
        </div>
        <input
          className="input px-3 py-1.5"
          placeholder="Suchen…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {list.map((tpl) => (
          <article key={tpl.id} className="rounded-2xl border border-white/30 bg-white/65 p-4 backdrop-blur-lg shadow-soft">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-semibold">{tpl.title}</div>
                <div className="text-sm opacity-80">{tpl.purpose}</div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {tpl.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-white/30 bg-white/60 px-2 py-0.5 text-xs backdrop-blur-md">
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
                onClick={() => applyTemplate(tpl)}
                className="w-full rounded-[14px] border border-white/30 bg-white/60 px-3 py-2 backdrop-blur-md active:scale-[0.98]"
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
