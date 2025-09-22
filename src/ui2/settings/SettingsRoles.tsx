import React, { useMemo, useState } from "react";

import Accordion, { AccordionItem } from "../../components/ui/Accordion";
import BottomSheet from "../../components/ui/BottomSheet";
import Card from "../../components/ui/Card";
import { ROLE_CATEGORIES, ROLES } from "../data/roles";

export default function SettingsRoles() {
  const [query, setQuery] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheet, setSheet] = useState<{ title: string; description: string } | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q
      ? ROLES.filter((r) =>
          (r.title + " " + r.summary + " " + r.description).toLowerCase().includes(q),
        )
      : ROLES;
  }, [query]);

  const sections: AccordionItem[] = ROLE_CATEGORIES.map((cat) => ({
    title: `${cat}`,
    meta: `${filtered.filter((r) => r.category === cat).length} Rollen verfügbar`,
    content: (
      <div className="space-y-2">
        {filtered
          .filter((r) => r.category === cat)
          .map((r) => (
            <Card
              key={r.id}
              title={r.title}
              meta={r.summary}
              active={r.active}
              onClick={() => {
                setSheet({ title: r.title, description: r.description });
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
          placeholder="Rollen suchen…"
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
