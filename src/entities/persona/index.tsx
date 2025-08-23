import React from "react";
import type { PersonaData, PersonaStyle } from "./types";

export type PersonaCtx = {
  data: PersonaData;
  warnings: string[];
  error: string | null;
  reload: () => void;
};
export const PersonaContext = React.createContext<PersonaCtx>({
  data: { models: [], styles: [] },
  warnings: [],
  error: null,
  reload: () => {}
});

async function fetchJSON(url: string): Promise<any | null> {
  try {
    const r = await fetch(url, { cache: "no-cache" });
    if (!r.ok) return null;
    return await r.json();
  } catch { return null; }
}

export function PersonaProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = React.useState<PersonaData>({ models: [], styles: [] });
  const [warnings, setWarnings] = React.useState<string[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    setWarnings([]); setError(null);
    // Wir lesen aus /personas.json (public), mit Fallbacks
    let raw = await fetchJSON("/personas.json");
    if (!raw) {
      // Minimaler Fallback
      raw = {
        models: [{ id: "openrouter/auto", label: "Auto (OpenRouter)" }],
        styles: [{ id: "neutral", name: "Sachlich", system: "Antworte kurz, präzise, auf Deutsch." }]
      };
      setError("Konfiguration nicht gefunden – Fallback aktiv.");
    }
    // Validierung rudimentär
    const styles: PersonaStyle[] = Array.isArray(raw.styles) && raw.styles.length
      ? raw.styles.filter((s: any) => s && s.id && s.name && s.system)
      : [{ id: "neutral", name: "Sachlich", system: "Antworte kurz, präzise, auf Deutsch." }];
    if (!Array.isArray(raw.styles) || !raw.styles.length) setWarnings((w)=>[...w, "Stile leer – Default genutzt."]);
    const models = Array.isArray(raw.models) ? raw.models.filter((m: any)=>m && m.id && m.label) : [];
    setData({ models, styles });
  }, []);

  React.useEffect(() => { void load(); }, [load]);

  return (
    <PersonaContext.Provider value={{ data, warnings, error, reload: load }}>
      {children}
    </PersonaContext.Provider>
  );
}
