import * as React from "react";
import { useModel } from "../hooks/useModel";
import { labelForModel } from "../config/models";

export default function Settings(): JSX.Element {
  const { model, setModel, list, labelFor } = useModel({ preferFree: true });
  const [freeOnly, setFreeOnly] = React.useState<boolean>(false);
  const [apiKey, setApiKey] = React.useState<string>("");

  const filtered = React.useMemo(
    () => (freeOnly ? list.filter((m) => m.free) : list),
    [list, freeOnly]
  );

  const selectedLabel = labelFor(model);

  return (
    <div className="p-4 md:p-6 space-y-8 text-neutral-900 dark:text-neutral-100">
      <section className="space-y-2">
        <h1 className="text-xl font-semibold">Einstellungen</h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Wähle das Standard-Modell und optional nur kostenlose Modelle anzeigen.
        </p>
      </section>

      <section className="space-y-3">
        <label htmlFor="model" className="block text-sm font-medium">
          Modell
        </label>

        {/* Anzeige mit Truncation + Tooltip für lange Labels */}
        <div
          className="max-w-full md:max-w-xl truncate text-sm text-neutral-800 dark:text-neutral-200"
          title={selectedLabel}
        >
          Ausgewählt: {selectedLabel}
        </div>

        <select
          id="model"
          className="block w-full md:max-w-xl rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 py-2 px-3 outline-none focus:ring-2 focus:ring-indigo-500"
          value={model}
          onChange={(e) => setModel(e.target.value)}
        >
          {filtered.map((m) => {
            const label = labelForModel(m.id, list);
            return (
              <option key={m.id} value={m.id} title={label}>
                {label}
              </option>
            );
          })}
        </select>

        <label className="inline-flex items-center gap-2 select-none">
          <input
            type="checkbox"
            className="h-4 w-4 accent-indigo-600"
            checked={freeOnly}
            onChange={(e) => setFreeOnly(e.target.checked)}
          />
          <span className="text-sm">Nur kostenlose Modelle anzeigen</span>
        </label>
      </section>

      <section className="space-y-2">
        <label htmlFor="apikey" className="block text-sm font-medium">
          OpenRouter API-Key (optional, nur lokal)
        </label>
        <input
          id="apikey"
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="block w-full md:max-w-xl rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 caret-neutral-700 dark:caret-neutral-200 py-2 px-3 outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="sk-or-…"
        />
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Hinweis: Key wird nicht automatisch gespeichert. Implementiere Speicherung bewusst, wenn gewünscht.
        </p>
      </section>
    </div>
  );
}
