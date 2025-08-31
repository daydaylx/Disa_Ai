import YAML from "js-yaml";

import { publicAsset } from "./publicAsset";

/** Stil-Eintrag – optionale Felder sind wirklich optional (exactOptionalPropertyTypes-freundlich). */
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
    system: "Du bist ein sachlicher, hilfreicher Assistent. Antworte klar und strukturiert.",
    description: "Nüchtern, faktisch, ohne Floskeln.",
  },
  {
    id: "sarkastisch",
    name: "Sarkastisch Direkt",
    system: "Du bist direkt mit trockenem Humor. Ironisch, aber respektvoll.",
    description: "Bissig, aber hilfreich.",
  },
];

/** beliebige JSON/YAML-Struktur -> StyleItem[], ohne undefined-Felder zu setzen */
export function normalizeStyles(input: unknown): StyleItem[] {
  const arr = Array.isArray((input as any)?.styles)
    ? (input as any).styles
    : Array.isArray(input)
      ? input
      : [];

  const out: StyleItem[] = arr
    .map((raw: any, i: number) => {
      const r: any = raw || {};
      const name: string = r.name ?? r.title ?? r.label ?? `Style ${i + 1}`;
      const id: string = (r.id ?? r.key ?? slug(name)) || `style-${i + 1}`;
      const sys = r.system ?? r.prompt ?? r.systemPrompt ?? r.sys;
      const desc = r.description ?? r.desc ?? r.about;
      const allow = Array.isArray(r.allow)
        ? r.allow.filter((x: unknown) => typeof x === "string")
        : undefined;

      const base: Partial<StyleItem> = { id: String(id), name: String(name) };
      if (typeof sys === "string") base.system = sys;
      if (typeof desc === "string") base.description = desc;
      if (allow && allow.length) base.allow = allow;
      return base as StyleItem;
    })
    .filter((s: StyleItem) => s.name);

  return out.length ? out : FALLBACK_STYLES;
}

/** lädt aus /public: probiert YAML vor JSON, mehrere Dateinamen */
export async function loadStyles(signal?: AbortSignal): Promise<StyleItem[]> {
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

  for (const url of CANDIDATE_URLS) {
    try {
      const res = await fetch(publicAsset(url), { signal: signal ?? null });
      if (!res.ok) continue;
      const text = await res.text();
      if (!text) continue;

      let parsed: unknown;
      if (url.endsWith(".yaml") || url.endsWith(".yml")) {
        parsed = YAML.load(text);
      } else {
        parsed = JSON.parse(text);
      }

      const normalized = normalizeStyles(parsed);
      if (normalized.length) return normalized;
    } catch {
      // weiter probieren
    }
  }
  return FALLBACK_STYLES;
}

/** simpler Slug */
function slug(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
