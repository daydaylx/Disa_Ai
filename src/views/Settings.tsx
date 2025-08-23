import React from "react";
import { usePersonaSelection } from "../config/personas";
import { loadModelCatalog, chooseDefaultModel, labelForModel, type ModelEntry } from "../config/models";

const KEY_NAME = "disa_api_key";
const MODEL_KEY = "disa_model";

export default function Settings() {
  const { styles, styleId, setStyleId, current, loading: stylesLoading, error: stylesError } = usePersonaSelection();

  const [apiKey, setApiKey] = React.useState<string | null>(() => {
    try { return localStorage.getItem(KEY_NAME); } catch { return null; }
  });
  const [models, setModels] = React.useState<ModelEntry[]>([]);
  const [freeOnly, setFreeOnly] = React.useState<boolean>(false);
  const [modelId, setModelId] = React.useState<string>(() => {
    try { return localStorage.getItem(MODEL_KEY) ?? ""; } catch { return ""; }
  });

  // Lade Model-Katalog (abhängig von Stil, weil allow[] Filter)
  React.useEffect(() => {
    let alive = true;
    (async () => {
      const allow = current?.allow ?? null;
      const list = await loadModelCatalog({ allow }).catch(() => []);
      if (!alive) return;
      setModels(list);
      if (!modelId) {
        const chosen = chooseDefaultModel(list);
        setModelId(chosen);
        try { localStorage.setItem(MODEL_KEY, chosen); } catch {}
      } else {
        // falls gespeichertes Modell nicht (mehr) existiert, fallback
        if (!list.some(m => m.id === modelId)) {
          const chosen = chooseDefaultModel(list);
          setModelId(chosen);
          try { localStorage.setItem(MODEL_KEY, chosen); } catch {}
        }
      }
    })();
    return () => { alive = false; };
  }, [current?.allow]); // nur neu laden, wenn allow des Stils sich ändert

  // Persist API-Key
  React.useEffect(() => {
    try {
      if (apiKey && apiKey.trim()) localStorage.setItem(KEY_NAME, apiKey.trim());
      else localStorage.removeItem(KEY_NAME);
    } catch {}
  }, [apiKey]);

  // Persist Modell
  React.useEffect(() => {
    try {
      if (modelId) localStorage.setItem(MODEL_KEY, modelId);
      else localStorage.removeItem(MODEL_KEY);
    } catch {}
  }, [modelId]);

  const visibleModels = React.useMemo(
    () => models.filter(m => (freeOnly ? m.free : true)),
    [models, freeOnly]
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      <header>
        <h1 className="text-2xl font-semibold">Einstellungen</h1>
        <p className="text-sm text-zinc-400">API-Key, Stil & Modell auswählen.</p>
      </header>

      <section className="space-y-3">
        <label className="block text-sm font-medium">OpenRouter API Key</label>
        <input
          className="w-full rounded-lg bg-zinc-900 border border-zinc-700 px-3 py-2 outline-none focus:ring-2 focus:ring-violet-500"
          placeholder="sk-or-v1-…"
          value={apiKey ?? ""}
          onChange={e => setApiKey(e.target.value || null)}
          aria-label="OpenRouter API Key"
        />
        <p className="text-xs text-zinc-500">Wird lokal gespeichert (kein Server-Speicher).</p>
      </section>

      <section className="space-y-3">
        <label className="block text-sm font-medium">Stil</label>
        <select
          className="w-full rounded-lg bg-zinc-900 border border-zinc-700 px-3 py-2"
          value={styleId ?? ""}
          onChange={(e) => setStyleId(e.target.value || null)}
        >
          {styles.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        {stylesError && <p className="text-xs text-red-400">{stylesError}</p>}
        {stylesLoading && <p className="text-xs text-zinc-500">Stile werden geladen…</p>}
        {current?.description && <p className="text-xs text-zinc-400">{current.description}</p>}
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Modell</label>
          <label className="text-xs flex items-center gap-2 cursor-pointer select-none">
            <input type="checkbox" checked={freeOnly} onChange={(e)=>setFreeOnly(e.target.checked)} />
            nur Free
          </label>
        </div>
        <select
          className="w-full rounded-lg bg-zinc-900 border border-zinc-700 px-3 py-2"
          value={modelId}
          onChange={(e) => setModelId(e.target.value)}
        >
          {visibleModels.map(m => (
            <option key={m.id} value={m.id}>
              {labelForModel(m.id, list)}
            </option>
          ))}
        </select>
        {!visibleModels.length && (
          <p className="text-xs text-zinc-500">
            Keine Modelle für diesen Filter. Schalte „nur Free“ aus oder entferne <code>allow[]</code> im Stil.
          </p>
        )}
      </section>
    </div>
  );
}
