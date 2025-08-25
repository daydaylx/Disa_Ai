import React from "react"
import InlineBanner from "../components/InlineBanner"
import { streamChatCompletion } from "../services/openrouter"
import { getSelectedModelId, getNSFW, getStyle, getTemplateId } from "../config/settings"
import { loadModelCatalog, chooseDefaultModel } from "../config/models"
import { buildSystemPrompt } from "../config/promptStyles"
import { useReducedMotion } from "../hooks/useReducedMotion"
import { getRoleById } from "../config/promptTemplates"

type Msg = { id: string; role: "user" | "assistant" | "system"; content: string; t: number }

export default function ChatView() {
  const [messages, setMessages] = React.useState<Msg[]>([])
  const [input, setInput] = React.useState("")
  const [streaming, setStreaming] = React.useState(false)
  const reducedMotion = useReducedMotion()
  const [autoScroll, setAutoScroll] = React.useState<boolean>(() => !reducedMotion)
  const [error, setError] = React.useState<string | null>(null)
  const [modelId, setModelId] = React.useState<string | null>(getSelectedModelId())
  const [modelReady, setModelReady] = React.useState(false)
  const scrollRef = React.useRef<HTMLDivElement | null>(null)
  const abortRef = React.useRef<AbortController | null>(null)
  const bufferRef = React.useRef<string>("")

  React.useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        if (!modelId) {
          const list = await loadModelCatalog(false)
          const next = chooseDefaultModel(list, { preferFree: true })
          if (!alive) return
          setModelId(next)
        }
      } finally {
        if (alive) setModelReady(true)
      }
    })()
    return () => { alive = false }
  }, [])

  React.useEffect(() => {
    if (!autoScroll || !scrollRef.current) return
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages, streaming, autoScroll])

  const hasKey = (() => { try { return !!localStorage.getItem("disa:openrouter:key") } catch { return false } })()

  function push(role: Msg["role"], content: string) { setMessages((cur) => [...cur, { id: crypto.randomUUID(), role, content, t: Date.now() }]) }
  function appendAssistantChunk(chunk: string) {
    setMessages((cur) => {
      const next = cur.slice()
      const last = next[next.length - 1]
      if (!last || last.role !== "assistant") next.push({ id: crypto.randomUUID(), role: "assistant", content: chunk, t: Date.now() })
      else { last.content += chunk; last.t = Date.now() }
      return next
    })
  }
  function parseSSE(raw: string) {
    bufferRef.current += raw
    const lines = bufferRef.current.split(/\r?\n/)
    bufferRef.current = lines.pop() ?? ""
    for (const ln of lines) {
      const line = ln.trimStart()
      if (!line.startsWith("data:")) continue
      const data = line.slice(5).trim()
      if (!data || data === "[DONE]") continue
      try {
        const obj = JSON.parse(data)
        const delta = obj?.choices?.[0]?.delta?.content ?? obj?.choices?.[0]?.text ?? ""
        if (delta) appendAssistantChunk(delta)
      } catch { if (data) appendAssistantChunk(data) }
    }
  }

  async function send() {
    setError(null)
    const text = input.trim()
    if (!text || streaming) return
    if (!hasKey) { setError("Kein OpenRouter API-Key gespeichert."); return }
    if (!modelId) { setError("Kein Modell ausgewählt/verfügbar."); return }
    setInput("")
    push("user", text)
    setStreaming(true)
    bufferRef.current = ""
    const roleTmpl = getRoleById(getTemplateId())
    const base = buildSystemPrompt({ nsfw: getNSFW(), style: getStyle(), locale: "de-DE" })
    const system = [roleTmpl?.system ?? "", base].filter(Boolean).join("\n\n")
    const body = { model: modelId, stream: true, messages: [{ role: "system", content: system }, ...messages.filter((m) => m.role !== "system").map((m) => ({ role: m.role, content: m.content })), { role: "user", content: text }] }
    try {
      abortRef.current = await streamChatCompletion(body, { onChunk: (raw) => parseSSE(raw), onError: (err) => setError(err instanceof Error ? err.message : String(err)), onComplete: () => {} })
    } catch (e: any) {
      setError(e?.message ?? String(e))
      setStreaming(false)
      abortRef.current = null
      return
    }
    setTimeout(() => { setStreaming(false); abortRef.current = null }, 200)
  }

  function stop() { try { abortRef.current?.abort() } catch {} ; abortRef.current = null; setStreaming(false) }
  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void send() } }
  async function copyMessage(text: string) { try { await navigator.clipboard.writeText(text) } catch {} }

  return (
    <div className="h-full flex flex-col">
      {!hasKey && (
        <div className="p-3">
          <InlineBanner tone="warn" title="Kein OpenRouter API-Key – Chat ist deaktiviert." actions={<a href="#/settings" className="underline">Key speichern</a>}>
            Du kannst die Oberfläche testen. Zum Chatten Key in den Einstellungen hinterlegen.
          </InlineBanner>
        </div>
      )}

      <div ref={scrollRef} className="flex-1 overflow-auto px-4 py-4" role="log" aria-live="polite" aria-atomic="false">
        {messages.length === 0 && <div className="text-sm opacity-70">Neue Unterhaltung. Tippe unten eine Nachricht und drücke Enter (Shift+Enter = Zeilenumbruch).</div>}
        {messages.map((m) => (
          <div key={m.id} className={`mb-4 ${m.role === "user" ? "text-right" : "text-left"}`}>
            <div className="inline-flex items-start gap-2 max-w-[820px]">
              {m.role !== "user" && <div className="select-none text-xs opacity-60 mt-1" aria-hidden="true">AI</div>}
              <div className={`rounded-lg px-3 py-2 leading-relaxed whitespace-pre-wrap ${m.role === "user" ? "bg-neutral-200 dark:bg-neutral-800" : "bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800"}`}>
                {m.content}
              </div>
              <button type="button" onClick={() => copyMessage(m.content)} className="self-start text-xs px-2 py-1 rounded border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-blue-500" title="Nachricht kopieren" aria-label="Nachricht in die Zwischenablage kopieren">
                Copy
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-neutral-200 dark:border-neutral-800 p-3">
        <div className="mb-2 flex flex-wrap items-center gap-3 text-xs text-neutral-600 dark:text-neutral-400">
          <label className="flex items-center gap-1 cursor-pointer select-none">
            <input type="checkbox" checked={autoScroll} onChange={(e) => setAutoScroll(e.target.checked)} aria-label="Automatisches Scrollen aktivieren" />
            Auto-Scroll
          </label>
          <span className="opacity-60">Modell:</span>
          <span className="px-1.5 py-0.5 rounded bg-neutral-200/70 dark:bg-neutral-800/70">{modelReady ? (modelId ?? "—") : "lade…"}</span>
          <a href="#/settings" className="underline">ändern</a>
          {error && <span className="text-red-600 dark:text-red-400" role="alert">• {error}</span>}
        </div>

        <div className="flex items-end gap-2">
          <label className="sr-only" htmlFor="chat-input">Nachricht eingeben</label>
          <textarea
            id="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Nachricht eingeben… (Enter = Senden, Shift+Enter = Zeilenumbruch)"
            aria-label="Nachricht eingeben"
            className="flex-1 min-h-[60px] max-h-[240px] px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-blue-500"
          />
          {!streaming ? (
            <button type="button" onClick={send} disabled={!hasKey || !modelId || input.trim().length === 0} aria-label="Nachricht senden" className="px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-50 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-blue-500">
              Senden
            </button>
          ) : (
            <button type="button" onClick={stop} aria-label="Streaming stoppen" className="px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-blue-500">
              Stop
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
