import { useEffect, useMemo, useState } from "react";
import { readApiKey } from "../../lib/openrouter/key";
import type { Filters, ModelLike, Tag } from "./modelFilters";

export interface Model extends ModelLike {
  provider?: string;
}

export interface ModelsState {
  models: Model[];
  loading: boolean;
  error?: string; // optional
  source: "openrouter" | "public" | "builtin" | "memory" | "none";
  refresh: () => void;
}

const LS_KEY = "disa.models.cache.v1";
const LS_AT  = "disa.models.cache.ts";
const MAX_AGE_MS = 5 * 60_000;

const BUILTIN: Model[] = [
  {
    id: "qwen/qwen-2.5-coder-14b-instruct",
    label: "Qwen 2.5 Coder 14B",
    description: "Guter Allround-Coder (preiswert)",
    context: 131072,
    tags: ["code", "chat", "long"],
    pricing: { prompt: 0.5, completion: 0.5, free: false },
    provider: "openrouter"
  },
  {
    id: "mistralai/mistral-nemo",
    label: "Mistral Nemo",
    description: "Solider Chat, schnell & günstig",
    context: 131072,
    tags: ["chat", "long"],
    pricing: { prompt: 0.3, completion: 0.3, free: false },
    provider: "openrouter"
  },
  {
    id: "nousresearch/nous-hermes-2-mixtral",
    label: "Nous Hermes 2 Mixtral",
    description: "Beliebt für Roleplay/Chat",
    context: 32768,
    tags: ["chat"],
    pricing: { prompt: 0.2, completion: 0.2, free: false },
    provider: "openrouter"
  }
];

function loadCache(): { models: Model[]; ts: number } | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    const at = Number(localStorage.getItem(LS_AT) ?? "0");
    if (!raw) return null;
    const models = JSON.parse(raw) as Model[];
    return { models, ts: at };
  } catch {
    return null;
  }
}

function saveCache(models: Model[]) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(models));
    localStorage.setItem(LS_AT, String(Date.now()));
  } catch {}
}

async function fetchPublic(): Promise<Model[] | null> {
  try {
    const r = await fetch("/models.json", { cache: "no-store" });
    if (!r.ok) return null;
    const json = await r.json();
    if (!Array.isArray(json)) return null;
    return json as Model[];
  } catch {
    return null;
  }
}

async function fetchOpenRouter(): Promise<Model[] | null> {
  const key = readApiKey() || localStorage.getItem("openrouter_key") || localStorage.getItem("OPENROUTER_API_KEY");
  if (!key) return null;
  try {
    const r = await fetch("https://openrouter.ai/api/v1/models", {
      headers: { Authorization: `Bearer ${key}` }
    });
    if (!r.ok) throw new Error(`OpenRouter ${r.status}`);
    const data = (await r.json()) as any;
    const list: Model[] = (data.data ?? []).map((m: any) => {
      const id = String(m.id ?? m.name ?? "");
      const pricing = m.pricing || m.prices || {};
      const prompt = toPerMTok(pricing?.prompt);
      const completion = toPerMTok(pricing?.completion);
      const tags: Tag[] = [];
      if (m.topics?.includes?.("nsfw")) tags.push("nsfw");
      if (m.capabilities?.code) tags.push("code");
      if (m.capabilities?.vision) tags.push("vision");
      const ctx = Number(m.context_length ?? m.context ?? 0);
      if (ctx >= 128_000) tags.push("long");
      return {
        id,
        label: String(m.name || id),
        description: m.description || "",
        context: ctx || undefined,
        tags,
        pricing: {
          prompt: Number.isFinite(prompt) ? prompt : undefined,
          completion: Number.isFinite(completion) ? completion : undefined,
          free: m.pricing?.prompt === 0 && m.pricing?.completion === 0
        },
        provider: "openrouter"
      } as Model;
    });
    return list;
  } catch {
    return null;
  }
}

function toPerMTok(x: any): number {
  const n = Number(x);
  if (!Number.isFinite(n) || n <= 0) return Number.POSITIVE_INFINITY;
  return n * 1_000_000;
}

async function swrLoad(): Promise<{ models: Model[]; source: ModelsState["source"] }> {
  const cached = loadCache();
  if (cached && Date.now() - cached.ts < MAX_AGE_MS && Array.isArray(cached.models) && cached.models.length) {
    return { models: cached.models, source: "memory" };
  }
  const pub = await fetchPublic();
  if (pub && pub.length) {
    saveCache(pub);
    fetchOpenRouter().then((or) => { if (or && or.length) saveCache(or); });
    return { models: pub, source: "public" };
  }
  const or = await fetchOpenRouter();
  if (or && or.length) {
    saveCache(or);
    return { models: or, source: "openrouter" };
  }
  saveCache(BUILTIN);
  return { models: BUILTIN, source: "builtin" };
}

export function useModels(): { models: Model[]; loading: boolean; error?: string; source: ModelsState["source"]; refresh: () => void } {
  const [models, setModels] = useState<Model[]>([]);
  const [source, setSource] = useState<ModelsState["source"]>("none");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>(undefined);

  const load = async () => {
    setLoading(true);
    setError(undefined);
    try {
      const { models, source } = await swrLoad();
      setModels(models);
      setSource(source);
    } catch (e: any) {
      setError(e?.message ?? "Unbekannter Fehler");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const refresh = () => { load(); };

  // wichtig: error NUR setzen, wenn vorhanden
  const base = { models, loading, source, refresh } as const;
  const value = error ? { ...base, error } : base;

  return useMemo(() => value, [models, loading, source, error]);
}
