import React from "react"
import InlineBanner from "../components/InlineBanner"
import { streamChatCompletion } from "../services/openrouter"
import { getSelectedModelId, getNSFW, getStyle, getTemplateId, getUseRoleStyle } from "../config/settings"
import { loadModelCatalog, chooseDefaultModel } from "../config/models"
import { buildSystemPrompt } from "../config/promptStyles"
import { useReducedMotion } from "../hooks/useReducedMotion"
import { getRoleById } from "../config/promptTemplates"
import { generateRoleStyleText } from "../config/styleEngine"
import MessageBubble from "../components/MessageBubble"
import Icon from "../components/Icon"
import TopBar from "../components/TopBar"
import { newId } from "../utils/id"

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

  function push(role: Msg["role"], content: string) { setMessages((cur) => [...cur, { id: newId(), role, content, t: Date.now() }]) }
  function appendAssistantChunk(chunk: string) {
    setMessages((cur) => {
      const next = cur.slice()
      const last = next[next.length - 1]
      if (!last || last.role !== "assistant") next.push({ id: newId(), role: "assistant", content: chunk, t: Date.now() })
      else { last.content += chunk; last.t = Date.now() }
      return next
    })
  }

  function consumeEventBlock(block: string) {
    const lines = block.split(/\r?\n/)
    for (const ln of lines) {
      const line = ln.trimStart()
      if (!line.startsWith("data:")) continue
      const data = line.slice(5).trim()
      if (!data || data === "[DONE]") continue
      try {
        const obj = JSON.parse(data)
        const delta = obj?.choices?.[0]?.delta?.content ?? obj?.choices?.[0]?.text ?? ""
        if (delta) appendAssistantChunk(delta)
      } catch {
        if (data) appendAssistantChunk(data)
      }
    }
  }

  function parseSSE(raw: string, final = false) {
    bufferRef.current += raw
    let idx = bufferRef.current.indexOf("\n\n")
    while (idx >= 0) {
      const block = bufferRef.current.slice(0, idx)
      bufferRef.current = bufferRef.current.slice(idx + 2)
      consumeEventBlock(block)
      idx = bufferRef.current.indexOf("\n\n")
    }
    if (final && bufferRef.current.trim().length > 0) {
      consumeEventBlock(bufferRef.current)
      bufferRef.current = ""
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
    const roleStyle = generateRoleStyleText(roleTmpl?.id ?? null, getStyle(), getUseRoleStyle())
    const system = [roleTmpl?.system ?? "", base, roleStyle].filter(Boolean).join("\n\n")

    const body = {
      model: modelId,
      stream: true,
      messages: [
        { role: "system", content: system },
        ...messages.filter((m) => m.role !== "system").map((m) => ({ role: m.role, content: m.content })),
        { role: "user", content: text }
      ]
    }

    try {
      abortRef.current = await streamChatCompletion(
        body,
        {
          onChunk: (raw) => parseSSE(raw, false),
          onError: (err) => {
            const name = (err as any)?.name ?? ""
            if (name === "AbortError") return
            setError(err instanceof Error ? err.message : String(err))
            setStreaming(false)
          },
          onComplete: () => {
            try { parseSSE("\n\n", true) } catch {}
            setStreaming(false)
          }
        }
      )
    } catch (e: any) {
      setError(e?.message ?? String(e))
      setStreaming(false)
      abortRef.current = null
      return
    }
  }

  function stop() { try { abortRef.current?.abort() } catch {} ; abortRef.current = null; setStreaming(false) }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void send() } }
  async function copyMessage(text: string) { try { await navigator.clipboard.writeText(text) } catch {} }

  const charCount = input.length

  return (
    <div className="h-full flex flex-col bg-[radial-gradient(60%_60%_at_0%_0%,rgba(59,130,246,0.08),transparent_60%),radial-gradient(50%_60%_at_100%_0%,rgba(147,51,234,0.08),transparent_60%)]">
      <TopBar />

      {!hasKey && (
        <div className="p-3">
          <InlineBanner tone="warn" title="Kein OpenRouter API-Key – Chat ist deaktiviert." actions={<a href="#/settings" className="underline">Key speichern</a>}>
            Du kannst die Oberfläche testen. Zum Chatten Key in den Einstellungen hinterlegen.
          </InlineBanner>
        </div>
      )}

      <div ref={scrollRef} className="flex-1 overflow-auto px-4 py-6 sm:px-6">
        {messages.length === 0 && (
          <div className="mx-auto max-w-[860px] rounded-2xl border border-neutral-200/70 dark:border-neutral-800/70 bg-white/60 dark:bg-neutral-900/60 backdrop-blur p-6 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-medium mb-2">
              <Icon name="sparkles" width="18" height="18" />
              <span>Neue Unterhaltung</span>
            </div>
            <div className="text-sm opacity-80">Schreibe unten deine Nachricht und drücke Enter. Shift+Enter für Zeilenumbruch. Auto-Scroll kannst du in der Leiste unter dem Feld steuern.</div>
          </div>
        )}
        {messages.map((m) => (
          <MessageBubble key={m.id} role={m.role === "user" ? "user" : "assistant"} content={m.content} onCopy={copyMessage} />
        ))}
      </div>

      <div className="border-t border-neutral-200 dark:border-neutral-800 p-3 sm:p-4 bg-white/80 dark:bg-neutral-950/70 backdrop-blur">
        <div className="mx-auto max-w-[960px]">
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
            <div className="px-3 sm:px-4 py-2 border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-3 text-xs text-neutral-600 dark:text-neutral-400">
              <label className="flex items-center gap-1 cursor-pointer select-none">
                <input type="checkbox" checked={autoScroll} onChange={(e) => setAutoScroll(e.target.checked)} aria-label="Automatisches Scrollen aktivieren" />
                Auto-Scroll
              </label>
              <div className="ml-auto inline-flex items-center gap-1">
                <span className="opacity-60">Zeichen:</span>
                <span>{charCount}</span>
                <span className="hidden sm:inline opacity-60">•</span>
                <a href="#/settings" className="hidden sm:inline underline">Einstellungen</a>
              </div>
              {error && <span className="text-red-600 dark:text-red-400" role="alert">• {error}</span>}
            </div>

            <div className="px-3 sm:px-4 py-3 flex items-end gap-2">
              <label className="sr-only" htmlFor="chat-input">Nachricht eingeben</label>
              <textarea
                id="chat-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Nachricht eingeben…"
                aria-label="Nachricht eingeben"
                className="flex-1 min-h-[72px] max-h-[240px] px-3 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-blue-500"
              />
              {!streaming ? (
                <button
                  type="button"
                  onClick={send}
                  disabled={!hasKey || !modelId || input.trim().length === 0}
                  aria-label="Nachricht senden"
                  className="shrink-0 inline-flex items-center gap-2 px-3 sm:px-4 py-3 rounded-xl border border-blue-600 bg-blue-600 text-white hover:brightness-110 disabled:opacity-50 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-blue-500"
                >
                  <Icon name="send" width="18" height="18" />
                  <span className="hidden sm:inline">Senden</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={stop}
                  aria-label="Streaming stoppen"
                  className="shrink-0 inline-flex items-center gap-2 px-3 sm:px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-blue-500"
                >
                  <Icon name="stop" width="16" height="16" />
                  <span className="hidden sm:inline">Stop</span>
                </button>
              )}
            </div>

            <div className="px-3 sm:px-4 py-2 border-t border-neutral-200 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-400 flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full border border-neutral-300 dark:border-neutral-700">
                <Icon name="model" width="14" height="14" />
                <span className="truncate max-w-[200px]">{modelReady ? (modelId ?? "—") : "lade…"}</span>
              </span>
              <span className="opacity-60">•</span>
              <a href="#/settings" className="underline">Modell ändern</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
