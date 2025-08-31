import { getRawModels } from "../services/openrouter"

export type Price = { in: number; out: number }
export type Safety = "strict" | "moderate" | "loose"

export type ModelEntry = {
  id: string
  label: string
  provider?: string
  ctx?: number
  tags: string[]
  price?: Price
  safety?: Safety
}

export const DEFAULT_MODEL_ID = "google/gemma-2-9b-it:free"
const SESSION_CACHE_KEY = "disa:modelCatalog:v2"
const MODEL_CACHE_TTL_MS = 6 * 60 * 60 * 1000

function parseProvider(id: string): string | undefined {
  const idx = id.indexOf("/")
  return idx > 0 ? id.slice(0, idx) : undefined
}

export function labelForModel(id: string, name?: string): string {
  if (name && name.trim().length > 0) return name.trim()
  const idx = id.indexOf("/")
  return idx > 0 ? id.slice(idx + 1) : id
}

function detectTags(raw: any): string[] {
  const tags: string[] = []
  const id: string = raw?.id ?? ""
  const name: string = raw?.name ?? ""
  const lower = `${id} ${name}`.toLowerCase()
  if (lower.includes("free") || lower.includes(":free")) tags.push("free")
  if (raw?.context_length && raw.context_length >= 16000) tags.push("large-context")
  if (/(vision|multimodal|omni|gpt-4o|llava|llama-3\.\d+.*vision)/.test(lower)) tags.push("vision")
  if (/\bjson\b|function|tools?/.test(lower)) tags.push("json")
  if (/deepseek[-_]?r1|(^|[^a-z])r1([^a-z]|$)|thinking|reason/.test(lower)) tags.push("reasoning")
  return tags
}

function detectSafety(provider?: string, id?: string, name?: string): Safety {
  const p = (provider ?? "").toLowerCase()
  const s = `${id ?? ""} ${name ?? ""}`.toLowerCase()
  const STRICT_PROVIDERS = ["openai", "anthropic", "google"]
  const MODERATE_PROVIDERS = ["mistralai", "cohere", "perplexity"]
  const LOOSE_PROVIDERS = ["meta", "meta-llama", "qwen", "deepseek", "tiiuae", "nousresearch", "phind", "gryphe", "sao10k"]
  if (STRICT_PROVIDERS.includes(p)) return "strict"
  if (LOOSE_PROVIDERS.includes(p)) return "loose"
  if (MODERATE_PROVIDERS.includes(p)) return "moderate"
  if (/\buncensored\b|\bnsfw\b|\braw\b|\bno[-_ ]safety\b/.test(s)) return "loose"
  if (/\bsafe\b|\bguard\b|\bshield\b|\bmoderated\b/.test(s)) return "strict"
  return "moderate"
}

function normalizeEntry(raw: any): ModelEntry | null {
  const id = String(raw?.id ?? "").trim()
  if (!id) return null
  const label = labelForModel(id, raw?.name)
  const provider = parseProvider(id)
  const ctx = typeof raw?.context_length === "number" ? raw.context_length : undefined
  const entry: ModelEntry = { id, label, tags: detectTags(raw) }
  if (provider !== undefined) entry.provider = provider
  if (ctx !== undefined) entry.ctx = ctx
  const p = raw?.pricing ?? raw?.price
  if (p) {
    const input = Number(p?.prompt ?? p?.input ?? p?.in)
    const output = Number(p?.completion ?? p?.output ?? p?.out)
    if (Number.isFinite(input) && Number.isFinite(output)) entry.price = { in: input, out: output }
  }
  const safety = detectSafety(provider, id, raw?.name)
  entry.safety = safety
  entry.tags.push(safety === "strict" ? "policy-strict" : safety === "moderate" ? "policy-moderate" : "policy-loose")
  return entry
}

type CatalogCache = { ts: number; items: ModelEntry[] }

export async function loadModelCatalog(forceReload = false): Promise<ModelEntry[]> {
  if (!forceReload) {
    try {
      const raw = sessionStorage.getItem(SESSION_CACHE_KEY)
      if (raw) {
        const cached = JSON.parse(raw) as CatalogCache
        if (cached?.ts && Array.isArray(cached.items) && Date.now() - cached.ts < MODEL_CACHE_TTL_MS) {
          return cached.items
        }
      }
    } catch {}
  }
  const data = await getRawModels()
  const rawList: any[] = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : []
  const normalized = rawList
    .map((r) => normalizeEntry(r))
    .filter((x): x is ModelEntry => !!x)
    .sort((a, b) => a.label.localeCompare(b.label))
  try { sessionStorage.setItem(SESSION_CACHE_KEY, JSON.stringify({ ts: Date.now(), items: normalized } as CatalogCache)) } catch {}
  return normalized
}

export function chooseDefaultModel(list: ModelEntry[], opts?: { preferFree?: boolean; allow?: string[] | null }): string {
  const allow = opts?.allow
  const preferFree = opts?.preferFree ?? true
  const candidates = Array.isArray(allow) && allow.length > 0 ? list.filter((m) => allow.includes(m.id)) : list.slice()
  if (preferFree) { const free = candidates.find((m) => m.tags.includes("free")); if (free) return free.id }
  return candidates[0]?.id ?? DEFAULT_MODEL_ID
}

export function pricePer1k(m?: ModelEntry["price"]): { in: number; out: number } | null {
  if (!m) return null
  return { in: m.in / 1000, out: m.out / 1000 }
}

export function listProviders(list: ModelEntry[]): string[] {
  const s = new Set<string>()
  for (const m of list) if (m.provider) s.add(m.provider)
  return Array.from(s).sort()
}

export function hasTag(m: ModelEntry, tag: string): boolean {
  return m.tags.includes(tag)
}
