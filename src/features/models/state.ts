import { useEffect, useMemo, useState } from "react";
import { readApiKey } from "../../lib/openrouter/key";
import type { Filters, ModelLike, Tag } from "./modelFilters";

export interface Model extends ModelLike {
  // Falls ModelLike bereits provider:string definiert, erfüllt dieser Typ das.
}

export interface ModelsState {
  models: Model[];
  loading: boolean;
  /** optional: Feld nur setzen, wenn vorhanden (exactOptionalPropertyTypes) */
  error?: string;
  source: "openrouter" | "public" | "builtin" | "memory" | "none";
  refresh: () => void;
}

/* -------------------- OpenRouter Types -------------------- */

type ORPrice = number | string | null | undefined;
interface ORPricing {
  prompt?: ORPrice;
  completion?: ORPrice;
}
interface ORCapabilities {
  code?: boolean;
  vision?: boolean;
}
interface ORModel {
  id?: string;
  name?: string;
  pricing?: ORPricing;
  prices?: ORPricing;
  tags?: string[];
  topics?: string[];
  capabilities?: ORCapabilities;
  context_length?: number;
  arch?: { family?: string } | null;
  provider?: { name?: string; slug?: string } | null;
}
interface ORResponse {
  data?: ORModel[];
}

/* -------------------- Helpers -------------------- */

function toNumberUSDPerMTok(v: ORPrice): number | undefined {
  if (v == null) return undefined;
  if (typeof v === "number") return v;
  const s = String(v).trim();
  const parsed = Number(s);
  return Number.isFinite(parsed) ? parsed : undefined;
}
function normalizePricing(
  pricing?: ORPricing,
): { prompt?: number; completion?: number } | undefined {
  if (!pricing) return undefined;
  const prompt = toNumberUSDPerMTok(pricing.prompt);
  const completion = toNumberUSDPerMTok(pricing.completion);
  if (prompt == null && completion == null) return undefined;
  return { ...(prompt != null ? { prompt } : {}), ...(completion != null ? { completion } : {}) };
}
function deriveTags(m: ORModel): Tag[] {
  const tags = new Set<Tag>();
  const raw = (m.tags ?? []).concat(m.topics ?? []);
  for (const t of raw) {
    const s = (t ?? "").toString().toLowerCase();
    if (s.includes("nsfw")) tags.add("nsfw");
    if (s.includes("code")) tags.add("code");
    if (s.includes("vision") || s.includes("image")) tags.add("vision");
    if (s.includes("free")) tags.add("free");
    if (s.includes("long") || s.includes("xl") || s.includes("32k") || s.includes("128k"))
      tags.add("long");
  }
  if (m.capabilities?.code) tags.add("code");
  return Array.from(tags);
}
function labelOf(m: ORModel): string {
  const id = m.id ?? m.name ?? "";
  return String(id);
}
function providerOf(m: ORModel): string {
  const p = m.provider;
  if (!p) return "";
  const name = (p.name ?? p.slug ?? "").toString();
  return name;
}

/* -------------------- Fetch -------------------- */

async function fetchOpenRouterModels(key: string, signal?: AbortSignal): Promise<Model[]> {
  const r = await fetch("https://openrouter.ai/api/v1/models", {
    headers: { Authorization: `Bearer ${key}` },
    signal: signal ?? null,
  });
  if (!r.ok) throw new Error(`OpenRouter ${r.status}`);
  const data = (await r.json()) as ORResponse;
  const list = Array.isArray(data.data) ? data.data : [];
  return list
    .map<Model>((m) => {
      const id = String(m.id ?? m.name ?? "");
      const p = normalizePricing(m.pricing ?? (m as any).prices);
      return {
        id,
        label: labelOf(m),
        description: m.arch?.family ? `Architektur: ${m.arch.family}` : undefined,
        context: m.context_length,
        tags: deriveTags(m),
        pricing: p,
        provider: providerOf(m), // immer string (auch wenn leer)
      } as Model;
    })
    .filter((m) => m.id.length > 0);
}

/* -------------------- Hook -------------------- */

export function useModels(): ModelsState {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [source, setSource] = useState<ModelsState["source"]>("none");
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let alive = true;
    const key = readApiKey();
    async function run() {
      setLoading(true);
      setError(undefined);
      try {
        if (key) {
          const list = await fetchOpenRouterModels(key);
          if (!alive) return;
          setModels(list);
          setSource("openrouter");
        } else {
          setModels([]);
          setSource("none");
        }
      } catch (e) {
        if (!alive) return;
        setModels([]);
        setSource("none");
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        if (alive) setLoading(false);
      }
    }
    void run();
    return () => {
      alive = false;
    };
  }, [tick]);

  const refresh = () => setTick((x) => x + 1);

  const memo = useMemo<ModelsState>(
    () => ({
      models,
      loading,
      ...(error !== undefined ? { error } : {}),
      source,
      refresh,
    }),
    [models, loading, error, source],
  );
  return memo;
}
