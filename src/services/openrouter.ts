export interface RetryOptions { retries: number; baseDelayMs: number; maxDelayMs: number; retryOn: number[] }
export interface FetchJsonOptions extends RequestInit { timeoutMs?: number; retry?: Partial<RetryOptions>; apiKey?: string }
export interface StreamCallback { onChunk: (text: string) => void; onError?: (err: unknown) => void; onComplete?: () => void }

const OPENROUTER_BASE = "https://openrouter.ai/api/v1"
const STORAGE_KEY = "disa:openrouter:key"

export function getApiKey(): string | null { try { return localStorage.getItem(STORAGE_KEY) } catch { return null } }
export function setApiKey(key: string) { localStorage.setItem(STORAGE_KEY, key) }
function sleep(ms: number) { return new Promise((res) => setTimeout(res, ms)) }

async function fetchWithRetry(input: string, init: FetchJsonOptions = {}) {
  const { timeoutMs = 20000, retry, apiKey, headers, ...rest } = init
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeoutMs)
  const effectiveKey = apiKey ?? getApiKey()
  const mergedHeaders: Record<string, string> = { "Content-Type": "application/json", ...(headers as Record<string, string>) }
  if (effectiveKey) { mergedHeaders["Authorization"] = `Bearer ${effectiveKey}`; mergedHeaders["HTTP-Referer"] = location.origin; mergedHeaders["X-Title"] = "Disa AI" }
  const retryConf: RetryOptions = { retries: retry?.retries ?? 3, baseDelayMs: retry?.baseDelayMs ?? 500, maxDelayMs: retry?.maxDelayMs ?? 5000, retryOn: retry?.retryOn ?? [429, 500, 502, 503, 504] }
  let attempt = 0
  try {
    while (true) {
      attempt++
      try {
        const res = await fetch(input, { ...rest, headers: mergedHeaders, signal: controller.signal })
        if (!retryConf.retryOn.includes(res.status) || attempt > retryConf.retries) { clearTimeout(id); return res }
        const delay = Math.min(retryConf.maxDelayMs, retryConf.baseDelayMs * Math.pow(2, attempt - 1))
        await sleep(delay)
      } catch (err: any) {
        if (err?.name === "AbortError") { clearTimeout(id); throw err }
        if (attempt > retryConf.retries) { clearTimeout(id); throw err }
        const delay = Math.min(retryConf.maxDelayMs, retryConf.baseDelayMs * Math.pow(2, attempt - 1))
        await sleep(delay)
      }
    }
  } finally { clearTimeout(id) }
}

export async function fetchJson<T>(path: string, init: FetchJsonOptions = {}): Promise<T> {
  const res = await fetchWithRetry(`${OPENROUTER_BASE}${path}`, init)
  const text = await res.text()
  if (!res.ok) {
    let payload: any
    try { payload = JSON.parse(text) } catch { payload = { error: text } }
    const msg = payload?.error?.message ?? payload?.error ?? text ?? `HTTP ${res.status}`
    throw new Error(`OpenRouter ${res.status}: ${msg}`)
  }
  return JSON.parse(text) as T
}

export async function streamChatCompletion(body: unknown, cb: StreamCallback, init?: Omit<FetchJsonOptions, "headers" | "method" | "body">): Promise<AbortController> {
  const controller = new AbortController()
  const effectiveKey = init?.apiKey ?? getApiKey()
  const headers: Record<string, string> = { "Content-Type": "application/json", "Accept": "text/event-stream" }
  if (effectiveKey) { headers["Authorization"] = `Bearer ${effectiveKey}`; headers["HTTP-Referer"] = location.origin; headers["X-Title"] = "Disa AI" }
  const res = await fetch(`${OPENROUTER_BASE}/chat/completions`, { method: "POST", headers, body: JSON.stringify(body), signal: controller.signal })
  if (!res.ok || !res.body) { const text = await res.text().catch(() => ""); cb.onError?.(new Error(`Streaming failed ${res.status}: ${text}`)); controller.abort(); return controller }
  const reader = res.body.getReader()
  const dec = new TextDecoder()
  let done = false
  try {
    while (!done) {
      const chunk = await reader.read()
      done = chunk.done
      if (!done) cb.onChunk(dec.decode(chunk.value, { stream: true }))
    }
    cb.onComplete?.()
  } catch (err) {
    cb.onError?.(err)
  } finally {
    try { reader.releaseLock() } catch {}
  }
  return controller
}

export async function getRawModels(apiKey?: string) {
  const init = apiKey ? { apiKey } : {}
  return fetchJson<any>("/models", init as any)
}
