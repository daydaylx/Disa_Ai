import * as React from "react";
import { publicAsset } from "../lib/publicAsset";

export type StyleItem = {
  id: string;
  name: string;
  system?: string;
  description?: string;
};

export type PersonaData = {
  styles: StyleItem[];
};

const STYLE_KEY = "disa_style_id";

function slug(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function normalizeStyles(json: unknown): StyleItem[] {
  const source: any = json ?? {};
  const candidates: unknown[] = [
    source.styles,
    source?.persona?.styles,
    source.stile,
    source.templates,
    source.personas,
  ].filter(Boolean);

  let rawArr: any[] = [];
  for (const c of candidates) {
    if (Array.isArray(c) && c.length) {
      rawArr = c as any[];
      break;
    }
  }
  if (!Array.isArray(rawArr)) return [];

  const mapped = rawArr
    .map<StyleItem>((raw: any, i: number) => {
      const name: string = raw?.name ?? raw?.title ?? raw?.label ?? `Style ${i + 1}`;
      const id: string = (raw?.id ?? raw?.key ?? slug(name)) || `style-${i + 1}`;
      const sys = raw?.system ?? raw?.prompt ?? raw?.systemPrompt ?? raw?.sys;
      const desc = raw?.description ?? raw?.desc ?? raw?.about;

      const obj = { id: String(id), name: String(name) } as StyleItem;
      if (typeof sys === "string" && sys.trim()) obj.system = sys;
      if (typeof desc === "string" && desc.trim()) obj.description = desc;
      return obj;
    })
    .filter(s => !!s.name);

  // Duplikate nach id entfernen
  const seen = new Set<string>();
  return mapped.filter(s => (seen.has(s.id) ? false : (seen.add(s.id), true)));
}

async function fetchPersonaJson(): Promise<PersonaData> {
  const bust = String(((import.meta as any)?.env?.VITE_BUILD_ID) ?? Date.now());
  const urls = [
    `/persona.json?v=${bust}`,
    `persona.json?v=${bust}`,
    `${publicAsset("persona.json")}?v=${bust}`,
  ];

  let lastErr: unknown = null;

  for (const url of urls) {
    try {
      const res = await fetch(url, {
        cache: "no-store",
        headers: {
          accept: "application/json",
          "cache-control": "no-cache",
          pragma: "no-cache",
        },
      });

      const ct = res.headers.get("content-type") ?? "";
      const text = await res.text();

      if (!res.ok) throw new Error(`HTTP ${res.status} (${url})`);

      // SPA-Rewrite-Falle: index.html statt JSON
      if (!ct.includes("application/json") && /^\s*</.test(text)) {
        throw new Error(`Got HTML instead of JSON (${url})`);
      }

      const data = JSON.parse(text) as unknown;
      const styles = normalizeStyles(data);
      if (!styles.length) throw new Error(`Keine gültigen Stile in ${url}`);

      return { styles };
    } catch (e) {
      lastErr = e;
      console.warn("[persona] failed", url, e);
    }
  }

  const msg = lastErr instanceof Error ? lastErr.message : String(lastErr ?? "Unbekannter Fehler");
  throw new Error(`persona.json laden fehlgeschlagen: ${msg}`);
}

export const PersonaContext = React.createContext<{
  data: PersonaData;
  loading: boolean;
  error: string | null;
}>({
  data: { styles: [] },
  loading: true,
  error: null,
});

export function PersonaProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = React.useState<PersonaData>({ styles: [] });
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const d = await fetchPersonaJson();
        if (!alive) return;
        setData(d);
        console.warn("[persona] loaded styles:", d.styles.length);
      } catch (e) {
        if (!alive) return;
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  return (
    <PersonaContext.Provider value={{ data, loading, error }}>
      {children}
    </PersonaContext.Provider>
  );
}

/** Hook für Auswahl/Wechsel eines Stils inkl. Persistenz in localStorage. */
export function usePersonaSelection() {
  const { data, loading, error } = React.useContext(PersonaContext);
  const [styleId, setStyleId] = React.useState<string | null>(() => {
    try { return localStorage.getItem(STYLE_KEY); } catch { return null; }
  });

  // Default wählen, sobald geladen
  React.useEffect(() => {
    if (loading) return;
    if (!styleId && data.styles.length > 0) {
      try { localStorage.setItem(STYLE_KEY, data.styles[0].id); } catch {}
      setStyleId(data.styles[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, data.styles.length]);

  // Persistenz
  React.useEffect(() => {
    try {
      if (styleId) localStorage.setItem(STYLE_KEY, styleId);
      else localStorage.removeItem(STYLE_KEY);
    } catch {}
  }, [styleId]);

  const styles = data.styles;
  const current = React.useMemo<StyleItem | null>(
    () => styles.find(s => s.id === styleId) ?? null,
    [styles, styleId],
  );

  return { styles, loading, error, styleId, setStyleId, current };
}
