import type { JSX } from "react";

import { useStyleTemplate } from "../hooks/useStyleTemplate";

/**

Stil-Chips wie im alten UI.

Nutzt die public-Styles (useStyleTemplate) und setzt nur Auswahlzustand.
*/
type TemplateLite = { id: string; name: string };

export default function QuickStyles(): JSX.Element {
  const { list, templateId, setTemplateId, selected } = useStyleTemplate();

  // robust gegen undefiniert und abweichende Typen
  const items: TemplateLite[] = Array.isArray(list) ? (list as unknown as TemplateLite[]) : [];

  const selId: string = templateId ?? selected?.id ?? "";

  return (
    <section className="card">
      <h3 className="mb-2 text-lg font-semibold">Schnellzugriff: Stile</h3>
      <div className="flex flex-wrap gap-2">
        {items.map((t: TemplateLite) => {
          const active = t.id === selId;
          const label = t.name ?? t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                if (setTemplateId) setTemplateId(t.id);
              }}
              className={active ? "chip bg-accent-500 text-[var(--accent-foreground)]" : "chip"}
              title={label}
              aria-pressed={active}
            >
              {label}
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-xs text-text-muted">
        Systemprompt aus dem gewählten Stil wird automatisch vorangestellt.
      </p>
    </section>
  );
}
