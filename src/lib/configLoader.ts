import YAML from "js-yaml";

/** Stil-Eintrag – optional heißt: Property einfach weglassen, nicht `undefined` setzen */
export interface StyleItem {
  id: string;
  name: string;
  system?: string;
  description?: string;
  allow?: string[];
}

const FALLBACK_STYLES: StyleItem[] = [
  {
    id: "neutral",
    name: "Neutral Standard",
    system:
      "Du bist ein sachlicher, präziser Assistent. Keine Floskeln. Antworte knapp, korrekt und strukturiert.",
    description: "Nüchtern, faktisch, ohne Floskeln.",
  },
  {
    id: "kritisch",
    name: "Kritisch Direkt",
    system:
      "Du bewertest Vorschläge schonungslos ehrlich. Keine Weichzeichner. Risiken und Schwächen zuerst.",
    description: "Bissig, aber hilfreich.",
  },
];

/** Utility: sichere JSON-Parse */
function parseJsonSafe(text: string): unknown | null {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

/** Lädt Text (ohne CORS-Probleme, da aus /public) */
async function fetchText(url: string, signal?: AbortSignal): Promise<string | null> {
  try {
    const res = await fetch(url, { cache: "no-store", signal: signal ?? null });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

/** Kandidaten in sinnvoller Reihenfolge */
const CANDIDATE_URLS = [
  "/persona.yaml",
  "/persona.yml",
  "/styles.yaml",
  "/styles.yml",
  "/persona.json",
  "/personas.json",
  "/styles.json",
  "/style.json",
];

/** Validierung: bewusst minimalistisch, damit es nicht überstrikt wird */
export function validateStyles(input: unknown): StyleItem[] | null {
  const arr: unknown[] | null = Array.isArray(input)
    ? input
    : typeof input === "object" && input !== null && Array.isArray((input as any).styles)
      ? ((input as any).styles as unknown[])
      : null;

  if (!arr) return null;

  const out: StyleItem[] = [];
  const seen = new Set<string>();
  for (const it of arr) {
    const o = typeof it === "object" && it !== null ? (it as Record<string, unknown>) : null;
    if (!o) continue;
    const id = typeof o.id === "string" ? o.id.trim() : "";
    const name = typeof o.name === "string" ? o.name.trim() : "";
    if (!id || !name) continue;
    if (seen.has(id)) continue;
    seen.add(id);

    const item: StyleItem = { id, name };
    if (typeof o.system === "string" && o.system.trim()) item.system = o.system.trim();
    if (typeof o.description === "string" && o.description.trim())
      item.description = o.description.trim();
    if (Array.isArray(o.allow)) {
      const allow = (o.allow as unknown[])
        .map(String)
        .map((s) => s.trim())
        .filter(Boolean);
      if (allow.length) item.allow = allow;
    }
    out.push(item);
  }
  return out.length ? out : null;
}

/** lädt Styles (YAML bevorzugt, dann JSON), fällt auf Default zurück */
export async function loadStyles(signal?: AbortSignal): Promise<StyleItem[]> {
  for (const url of CANDIDATE_URLS) {
    const text = await fetchText(url, signal);
    if (!text) continue;

    if (url.endsWith(".yaml") || url.endsWith(".yml")) {
      try {
        const y = YAML.load(text) as unknown;
        const ok = validateStyles(y);
        if (ok) return ok;
      } catch {
        // nächste Quelle versuchen
      }
    } else {
      const j = parseJsonSafe(text);
      const ok = validateStyles(j);
      if (ok) return ok;
    }
  }
  return FALLBACK_STYLES.slice();
}
