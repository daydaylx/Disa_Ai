import React, { useMemo, useState } from "react";

import Accordion, { AccordionItem } from "../../components/ui/Accordion";
import BottomSheet from "../../components/ui/BottomSheet";
import Card from "../../components/ui/Card";
import { STYLE_CATEGORIES, STYLES } from "../data/styles";

export default function SettingsStyle() {
  const [query, setQuery] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheet, setSheet] = useState<{ title: string; description: string } | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q
      ? STYLES.filter((s) =>
          (s.title + " " + s.summary + " " + s.description).toLowerCase().includes(q),
        )
      : STYLES;
  }, [query]);

  const sections: AccordionItem[] = STYLE_CATEGORIES.map((cat) => ({
    title: `${cat}`,
    meta: `${filtered.filter((s) => s.category === cat).length} Stile verfügbar`,
    content: (
      <div className="space-y-2">
        {filtered
          .filter((s) => s.category === cat)
          .map((s) => (
            <Card
              key={s.id}
              title={s.title}
              meta={s.summary}
              active={s.active}
              onClick={() => {
                setSheet({ title: s.title, description: s.description });
                setSheetOpen(true);
              }}
            />
          ))}
      </div>
    ),
    defaultOpen: true,
  }));

  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Stile suchen…"
          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
        />
      </div>
      <Accordion items={sections} single={false} />
      <BottomSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title={sheet?.title ?? "Details"}
      >
        <div className="max-measure whitespace-pre-wrap">{sheet?.description}</div>
      </BottomSheet>
    </section>
  );
}
