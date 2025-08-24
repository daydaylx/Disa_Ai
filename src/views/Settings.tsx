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
    <div className="mx-auto max-w-3xl p-4 md:p-8">
      <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-sm">
        <div className="px-5 py-4 border-b border-neutral-200 dark:border-neutral-800">
          <h1 className="text-lg md:text-xl font-semibold text-neutral-900 dark:text-neutral-50">
            Einstellungen
          </h1>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            Modell wählen, kostenlose filtern, und optional API-Key setzen.
          </p>
        </div>

        <div className="p-5 space-y-8">
          {/* Modell-Auswahl */}
          <section className="space-y-2">
            <label htmlFor="model" className="block text-sm font-medium text-neutral-900 dark:text-neutral-100">
              Modell
            </label>

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
                // Option-Elemente unterstützen keine Tailwind-Truncation, daher full label + title
                return (
                  <option key={m.id} value={m.id} title={`${label} — ${m.provider}`}>
                    {label} — {m.provider}
                  </option>
                );
              })}
            </select>

            <div className="flex items-center justify-between">
              <label className="inline-flex items-center gap-2 select-none">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-indigo-600"
                  checked={freeOnly}
                  onChange={(e) => setFreeOnly(e.target.checked)}
                />
                <span className="text-sm text-neutral-800 dark:text-neutral-200">
                  Nur kostenlose Modelle anzeigen
                </span>
              </label>
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                {filtered.length} Modelle
              </span>
            </div>
          </section>

          {/* API-Key */}
          <section className="space-y-2">
            <label htmlFor="apikey" className="block text-sm font-medium text-neutral-900 dark:text-neutral-100">
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
              Hinweis: Key wird nicht automatisch gespeichert.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
