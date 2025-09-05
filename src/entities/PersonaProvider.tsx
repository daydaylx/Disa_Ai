import React from "react";
import { z } from "zod";
import { PersonaContext, type PersonaData, type PersonaModel, type PersonaStyle } from "./persona";

const modelSchema = z.object({
  id: z.string().trim().min(1),
  label: z.string().trim().min(1),
  tags: z.array(z.string().trim().min(1)).optional(),
  context: z.number().int().positive().max(4_000_000).optional(),
});
const styleSchema = z.object({
  id: z
    .string()
    .trim()
    .min(1)
    .regex(/^[a-z0-9._-]{1,64}$/i, "ungültige id"),
  name: z.string().trim().min(1).max(64),
  system: z.string().trim().min(1).max(4000),
  hint: z.string().trim().min(1).max(200).optional(),
  allow: z.array(z.string().trim().min(1)).optional(),
  deny: z.array(z.string().trim().min(1)).optional(),
});
const personaSchema = z.object({
  models: z.array(modelSchema),
  styles: z.array(styleSchema),
});

async function fetchMaybe(url: string): Promise<unknown | null> {
  try {
    const r = await fetch(url, { cache: "no-store" });
    if (!r.ok) return null;
    return await r.json();
  } catch {
    return null;
  }
}

function normalize(input: unknown): { data: PersonaData; warnings: string[] } {
  const warnings: string[] = [];
  // Erlaube sowohl Kombi-Datei {models,styles} als auch getrennt {styles} bzw. {models}
  const obj = typeof input === "object" && input !== null ? (input as Record<string, unknown>) : {};
  const modelsRaw = Array.isArray(obj["models"]) ? (obj["models"] as unknown[]) : [];
  const stylesRaw = Array.isArray(obj["styles"]) ? (obj["styles"] as unknown[]) : [];

  const models: PersonaModel[] = [];
  for (const it of modelsRaw) {
    const ok = modelSchema.safeParse(it);
    if (ok.success) models.push(ok.data);
    else warnings.push("modell verworfen: " + ok.error.issues.map((i) => i.message).join(", "));
  }

  const styles: PersonaStyle[] = [];
  const seen = new Set<string>();
  for (const it of stylesRaw) {
    const ok = styleSchema.safeParse(it);
    if (!ok.success) {
      warnings.push("style verworfen: " + ok.error.issues.map((i) => i.message).join(", "));
      continue;
    }
    const s = ok.data;
    if (seen.has(s.id)) {
      warnings.push(`doppelte style.id '${s.id}'`);
      continue;
    }
    seen.add(s.id);
    styles.push(s);
  }

  return { data: { models, styles }, warnings };
}

export function PersonaProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = React.useState<PersonaData>({ models: [], styles: [] });
  const [warnings, setWarnings] = React.useState<string[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    setError(null);
    setWarnings([]);
    // Bevorzugte Kombi-Datei
    const a = await fetchMaybe("/persona.json");
    if (a) {
      const { data: d, warnings: w } = normalize(a);
      setData(d);
      setWarnings(w);
      return;
    }
    // Fallback: getrennte Dateien
    const [m, s] = await Promise.all([fetchMaybe("/models.json"), fetchMaybe("/styles.json")]);
    if (!m && !s) {
      setData({ models: [], styles: [] });
      setError("persona.json / models.json / styles.json nicht gefunden oder ungültig");
      return;
    }
    const merged = {
      models:
        typeof m === "object" && m && Array.isArray((m as any).models)
          ? (m as any).models
          : Array.isArray(m)
            ? m
            : [],
      styles:
        typeof s === "object" && s && Array.isArray((s as any).styles)
          ? (s as any).styles
          : Array.isArray(s)
            ? s
            : [],
    };
    const { data: d, warnings: w } = normalize(merged);
    setData(d);
    setWarnings(w);
  }, []);

  React.useEffect(() => {
    void load();
  }, [load]);

  const value = React.useMemo(
    () => ({
      data,
      warnings,
      error,
      reload: () => {
        void load();
      },
    }),
    [data, warnings, error, load],
  );

  return <PersonaContext.Provider value={value}>{children}</PersonaContext.Provider>;
}
