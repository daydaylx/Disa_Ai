import * as React from "react";
import { useModel } from "../hooks/useModel";
import { labelForModel } from "../config/models";
import { useStyleTemplate } from "../hooks/useStyleTemplate";

const LS_FREE_ONLY = "disa:settings:freeOnly";
const LS_API_KEY = "disa:settings:apiKey";

function loadBool(key: string, def: boolean): boolean {
  if (typeof window === "undefined") return def;
  try {
    const v = window.localStorage.getItem(key);
    if (v === null) return def;
    return v === "1" || v === "true";
  } catch {
    return def;
  }
}
function saveBool(key: string, v: boolean): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, v ? "1" : "0");
  } catch {}
}
function loadStr(key: string, def = ""): string {
  if (typeof window === "undefined") return def;
  try {
    const v = window.localStorage.getItem(key);
    return v ?? def;
  } catch {
    return def;
  }
}
function saveStr(key: string, v: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, v);
  } catch {}
}

export default function Settings(): JSX.Element {
  // Persistente Settings
  const [apiKey, setApiKey] = React.useState<string>(() => loadStr(LS_API_KEY, ""));
  const [freeOnly, setFreeOnly] = React.useState<boolean>(() => loadBool(LS_FREE_ONLY, false));

  // Modelle
  const { model, setModel, list, labelFor } = useModel({
    preferFree: true,
    apiKey: apiKey || undefined,
  });

  React.useEffect(() => saveStr(LS_API_KEY, apiKey), [apiKey]);
  React.useEffect(() => saveBool(LS_FREE_ONLY, freeOnly), [freeOnly]);

  const filtered = React.useMemo(
    () => (freeOnly ? list.filter((m) => m.free) : list),
    [list, freeOnly]
  );
  const selectedLabel = labelFor(model);

  // Styles / Systemprompts aus public/style.json
  const {
    list: tplList,
    loading: tplLoading,
    error: tplError,
    templateId,
    setTemplateId,
    selected,
    systemText,
    setSystemText,
    reload: reloadTemplates,
  } = useStyleTemplate();

  return (
    <div className="mx-auto max-w-5xl p-4 md:p-8">
      <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-sm">
        <div className="px-5 py-4 border-b border-neutral-200 dark:border-neutral-800">
          <h1 className="text-lg md:text-xl font-semibold text-neutral-900 dark:text-neutral-50">
            Einstellungen
          </h1>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            Modellwahl, kostenlose Filter, OpenRouter-Key und Stil-Templates (aus <code>/style.json</code>).
          </p>
        </div>

        <div className="p-5 space-y-10">
          {/* Modell-Auswahl */}
          <section className="space-y-2">
            <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">Modell</h2>

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
                  <option key={m.id} value={m.id} title={`${label} — ${m.provider}`}>
                    {label} — {m.provider}{m.free ? " (FREE)" : ""}
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
            <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">OpenRouter</h2>
            <label
              htmlFor="apikey"
              className="block text-sm font-medium text-neutral-900 dark:text-neutral-100"
            >
              API-Key (optional, lokal gespeichert)
            </label>
            <input
              id="apikey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="block w-full md:max-w-xl rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 caret-neutral-700 dark:caret-neutral-200 py-2 px-3 outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="sk-or-…"
            />
          </section>

          {/* Stil-Templates */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
                Stil-Templates (Systemprompts)
              </h2>
              <div className="flex items-center gap-3">
                {tplLoading ? (
                  <span className="text-xs text-neutral-500">Lade …</span>
                ) : (
                  <button
                    type="button"
                    onClick={reloadTemplates}
                    className="text-xs rounded-md border border-neutral-300 dark:border-neutral-700 px-2 py-1 hover:bg-neutral-50 dark:hover:bg-neutral-900"
                    title="Neu laden (liest /style.json)"
                  >
                    Neu laden
                  </button>
                )}
              </div>
            </div>

            {tplError ? (
              <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md p-3">
                {tplError}
              </div>
            ) : null}

            <div className="space-y-2">
              <label htmlFor="template" className="block text-sm font-medium text-neutral-900 dark:text-neutral-100">
                Vorlage aus <code>/style.json</code>
              </label>
              <select
                id="template"
                className="block w-full md:max-w-xl rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 py-2 px-3 outline-none focus:ring-2 focus:ring-indigo-500"
                value={templateId}
                onChange={(e) => setTemplateId(e.target.value)}
              >
                {tplList.map((t) => (
                  <option key={t.id} value={t.id} title={t.description ?? t.name}>
                    {t.name}
                  </option>
                ))}
              </select>

              {selected?.description ? (
                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                  {selected.description}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <label htmlFor="systemText" className="block text-sm font-medium text-neutral-900 dark:text-neutral-100">
                Systemprompt (Edit speichert Override pro Vorlage)
              </label>
              <textarea
                id="systemText"
                value={systemText}
                onChange={(e) => setSystemText(e.target.value)}
                className="block w-full h-48 md:h-56 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 caret-neutral-700 dark:caret-neutral-200 p-3 outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Systemprompt …"
              />
              <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
                <span>{systemText.length} Zeichen</span>
                <button
                  type="button"
                  onClick={() => {
                    const base = selected?.system ?? "";
                    setSystemText(base);
                  }}
                  className="rounded-md border border-neutral-300 dark:border-neutral-700 px-2 py-1 hover:bg-neutral-50 dark:hover:bg-neutral-900"
                  title="Override auf Vorlagenstandard zurücksetzen"
                >
                  Auf Vorlagenstandard zurücksetzen
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
