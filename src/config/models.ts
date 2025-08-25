import { getRawModels } from "../services/openrouter"

export type Price = { in: number; out: number }
export type ModelEntry = { id: string; label: string; provider?: string; ctx?: number; tags: string[]; price?: Price }

export const DEFAULT_MODEL_ID = "google/gemma-2-9b-it:free"
const SESSION_CACHE_KEY = "disa:modelCatalog:v2"
const MODEL_CACHE_TTL_MS = 6 * 60 * 60 * 1000

function parseProvider(id: string): string | undefined { const idx = id.indexOf("/"); return idx > 0 ? id.slice(0, idx) : undefined }
export function labelForModel(id: string, name?: string): string { if (name && name.trim().length > 0) return name.trim(); const idx = id.indexOf("/"); return idx > 0 ? id.slice(idx + 1) : id }

function detectTags(raw: any): string[] {
  const tags: string[] = []
  const id: string = raw?.id ?? ""
  const name: string = raw?.name ?? ""
  const lower = `${id} ${name}`.toLowerCase()
  if (lower.includes("free") || lower.includes(":free")) tags.push("free")
  if (raw?.context_length && raw.context_length >= 16000) tags.push("large-context")
  return tags
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
  const normalized = rawList.map((r) => normalizeEntry(r)).filter((x): x is ModelEntry => !!x).sort((a, b) => a.label.localeCompare(b.label))
  try { sessionStorage.setItem(SESSION_CACHE_KEY, JSON.stringify({ ts: Date.now(), items: normalized } satisfies CatalogCache)) } catch {}
  return normalized
}

export function chooseDefaultModel(list: ModelEntry[], opts?: { preferFree?: boolean; allow?: string[] | null }): string {
  const allow = opts?.allow
  const preferFree = opts?.preferFree ?? true
  const candidates = Array.isArray(allow) && allow.length > 0 ? list.filter((m) => allow.includes(m.id)) : list.slice()
  if (preferFree) { const free = candidates.find((m) => m.tags.includes("free")); if (free) return free.id }
  return candidates[0]?.id ?? DEFAULT_MODEL_ID
}
