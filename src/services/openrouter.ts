const BASE = "https://openrouter.ai/api/v1"
const KEY_STORAGE = "disa:openrouter:key"

export type ORModel = {
  id: string
  name?: string
  context_length?: number
  pricing?: { prompt?: number; completion?: number }
  tags?: string[]
  // …weitere Felder ignorieren wir bewusst
}

export type StreamHandlers = {
  onChunk: (raw: string) => void
  onComplete: () => void
  onError: (err: unknown) => void
}

function buildHeaders(explicitKey?: string): Headers {
  const key = explicitKey ?? getApiKey() ?? ""
  const h = new Headers()
  if (key) h.set("Authorization", `Bearer ${key}`)
  h.set("Content-Type", "application/json")
  return h
}

export function getApiKey(): string | null {
  try { return localStorage.getItem(KEY_STORAGE) || null } catch { return null }
}
export function setApiKey(v: string) {
  try {
    if (!v) localStorage.removeItem(KEY_STORAGE)
    else localStorage.setItem(KEY_STORAGE, v.trim())
  } catch {}
}

/** Rohes Model-Listing (für config/models.ts) */
export async function getRawModels(explicitKey?: string): Promise<ORModel[]> {
  const res = await fetch(`${BASE}/models`, { headers: buildHeaders(explicitKey) })
  if (!res.ok) return []
  const data = await res.json().catch(() => ({}))
  return Array.isArray(data?.data) ? (data.data as ORModel[]) : []
}

/** Einfacher Verfügbarkeits-Check */
export async function pingOpenRouter(): Promise<boolean> {
  try {
    const list = await getRawModels()
    return Array.isArray(list)
  } catch {
    return false
  }
}

/** Streaming-Completion (SSE). Gibt AbortController zurück. */
export async function streamChatCompletion(
  body: any,
  handlers: StreamHandlers
): Promise<AbortController> {
  const key = getApiKey()
  if (!key) {
    const err = new Error("Missing API key")
    handlers.onError(err)
    throw err
  }

  const ctrl = new AbortController()
  try {
    const res = await fetch(`${BASE}/chat/completions`, {
      method: "POST",
      signal: ctrl.signal,
      headers: {
        "Authorization": `Bearer ${key}`,
        "Content-Type": "application/json",
        // kritisch: sonst liefern manche Backends chunked JSON statt SSE
        "Accept": "text/event-stream",
      },
      body: JSON.stringify(body),
    })

    if (!res.ok || !res.body) {
      const err: any = new Error(`HTTP ${res.status}`)
      err.status = res.status
      const ra = res.headers.get("retry-after")
      if (ra) err.retryAfter = Number(ra) || 0
      handlers.onError(err)
      return ctrl
    }

    const reader = res.body.getReader()
    const dec = new TextDecoder()
    while (true) {
      const { value, done } = await reader.read()
      if (done) break
      if (value) handlers.onChunk(dec.decode(value, { stream: true }))
    }
    handlers.onComplete()
  } catch (e) {
    handlers.onError(e)
  }
  return ctrl
}
