import { z } from "zod";
import YAML from "js-yaml";
import stripJsonComments from "strip-json-comments";

export type StyleItem = {
  id: string;
  name: string;
  system?: string;
  description?: string;
};

const StyleSchema = z.object({
  id: z.string(),
  name: z.string(),
  system: z.string().optional(),
  description: z.string().optional(),
});

const StylesSchema = z.object({
  styles: z.array(StyleSchema),
});

const CANDIDATES = ["/styles.json", "/styles.yaml", "/styles.yml", "/persona.json", "/personas.json"];

function slug(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 64) || "style";
}

function normalize(list: any[]): StyleItem[] {
  const out: StyleItem[] = list.map((raw, i) => {
    const r: any = raw || {};
    const name: string = r.name ?? r.title ?? r.label ?? `Style ${i + 1}`;
    const id: string = (r.id ?? r.key ?? slug(name)) || `style-${i + 1}`;
    const sys = r.system ?? r.prompt ?? r.systemPrompt ?? r.sys;
    const desc = r.description ?? r.desc ?? r.about;
    const base: Partial<StyleItem> = { id: String(id), name: String(name) };
    if (typeof sys === "string") base.system = sys;
    if (typeof desc === "string") base.description = desc;
    return base as StyleItem;
  }).filter(s => s.name && s.id);
  return out;
}

function parseByExt(url: string, text: string): unknown {
  const lower = url.toLowerCase();
  if (lower.endsWith(".yaml") || lower.endsWith(".yml")) {
    return YAML.load(text);
  }
  if (lower.endsWith(".jsonc")) {
    return JSON.parse(stripJsonComments(text));
  }
  if (lower.endsWith(".json")) {
    return JSON.parse(text);
  }
  // Heuristik: erst JSONC, dann YAML, dann nacktes JSON als Fallback
  try { return JSON.parse(stripJsonComments(text)); } catch {}
  try { return YAML.load(text); } catch {}
  return JSON.parse(text);
}

async function fetchOne(url: string): Promise<StyleItem[] | null> {
  try {
    const res = await fetch(url, { cache: "no-store", headers: { Accept: "application/json, text/yaml, text/plain" } });
    if (!res.ok) return null;
    const text = await res.text();
    const parsed = parseByExt(url, text);

    // akzeptiere { styles: [...] } oder direkt [...]
    if (Array.isArray(parsed)) {
      const validated = StylesSchema.parse({ styles: normalize(parsed) });
      return validated.styles;
    }
    const validated = StylesSchema.parse({ styles: normalize((parsed as any)?.styles ?? []) });
    return validated.styles;
  } catch {
    return null;
  }
}

export async function loadStyles(): Promise<{ styles: StyleItem[]; source: string | null }> {
  for (const url of CANDIDATES) {
    const styles = await fetchOne(url);
    if (styles && styles.length > 0) {
      return { styles, source: url };
    }
  }
  // harte Fallbacks
  const fallback: StyleItem[] = [
    { id: "neutral", name: "Neutral Standard", system: "Du bist sachlich, klar und hilfsbereit.", description: "Fallback-Stil" },
  ];
  return { styles: fallback, source: null };
}
