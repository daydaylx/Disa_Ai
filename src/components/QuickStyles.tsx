import * as React from "react";
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
    <section className="mt-4 rounded-2xl border border-neutral-800 bg-neutral-900/50 p-4">
      <h3 className="mb-2 text-lg font-semibold text-neutral-100">Schnellzugriff: Stile</h3>
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
              className={[
                "rounded-full border px-3 py-1.5 text-sm transition",
                active
                  ? "border-indigo-600 bg-indigo-600 text-white"
                  : "border-neutral-700 bg-neutral-900 text-neutral-200 hover:bg-neutral-800",
              ].join(" ")}
              title={label}
            >
              {label}
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-xs text-neutral-400">
        Systemprompt aus dem gewählten Stil wird automatisch vorangestellt.
      </p>
    </section>
  );
}
