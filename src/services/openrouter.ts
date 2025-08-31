const BASE = "https://openrouter.ai/api/v1"
const KEY_STORAGE = "disa:openrouter:key"
const APP_TITLE = "Disa AI"

export function getApiKey(): string | null {
  try { return localStorage.getItem(KEY_STORAGE) || null } catch { return null }
}
export function setApiKey(v: string) {
  try { if (!v) localStorage.removeItem(KEY_STORAGE); else localStorage.setItem(KEY_STORAGE, v) } catch {}
}

function buildHeaders(explicitKey?: string): Headers {
  const key = explicitKey ?? getApiKey() ?? ""
  const h = new Headers()
  if (key) h.set("Authorization", `Bearer ${key}`)
  h.set("Content-Type", "application/json")
  h.set("X-Title", APP_TITLE)
  return h
}

type FetchJsonOptions = RequestInit & { apiKey?: string | null }
export async function fetchJson<T = any>(path: string, opts?: FetchJsonOptions): Promise<T> {
  const url = path.startsWith("http") ? path : `${BASE}${path}`
  const init: RequestInit = {
    method: opts?.method ?? "GET",
    headers: buildHeaders(opts?.apiKey ?? undefined),
    body: opts?.body ?? null,
    mode: "cors",
    credentials: "omit",
    cache: "no-store",
  }
  const res = await fetch(url, init)
  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw Object.assign(new Error(`HTTP ${res.status} ${res.statusText} — ${text.slice(0,200)}`), { status: res.status, body: text })
  }
  return res.json() as Promise<T>
}

export async function getRawModels(apiKey?: string) { return fetchJson<any>("/models", { apiKey: apiKey ?? null }) }

export async function pingOpenRouter(): Promise<{ ok: boolean; status: number | null; corsBlocked: boolean; message: string }> {
  try {
    const res = await fetch(`${BASE}/models`, {
      method: "GET",
      headers: buildHeaders(),
      mode: "cors",
      credentials: "omit",
      cache: "no-store",
    })
    return { ok: res.ok, status: res.status, corsBlocked: false, message: res.ok ? "OK" : `HTTP ${res.status} ${res.statusText}` }
  } catch (e: any) {
    return { ok: false, status: null, corsBlocked: true, message: e?.message ?? "Network/CORS error" }
  }
}

export async function streamChatCompletion(
  body: any,
  handlers: { onChunk: (text: string) => void; onError: (err: any) => void; onComplete: () => void }
): Promise<AbortController> {
  const ctrl = new AbortController()
  const init: RequestInit = {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify(body),
    mode: "cors",
    credentials: "omit",
    cache: "no-store",
    signal: ctrl.signal,
  }
  try {
    const res = await fetch(`${BASE}/chat/completions`, init)
    if (!res.ok || !res.body) {
      const text = await res.text().catch(() => "")
      const err: any = new Error(`HTTP ${res.status} ${res.statusText} — ${text.slice(0,200)}`)
      err.status = res.status
      err.retryAfter = Number(res.headers.get("retry-after") ?? 0) || 0
      throw err
    }
    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    while (true) {
      const { value, done } = await reader.read()
      if (done) break
      if (value) handlers.onChunk(decoder.decode(value, { stream: true }))
    }
    handlers.onComplete()
  } catch (e) { handlers.onError(e) }
  return ctrl
}
