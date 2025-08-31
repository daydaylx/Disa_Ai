import React from "react"
import InlineBanner from "../components/InlineBanner"
import { streamChatCompletion } from "../services/openrouter"
import { getSelectedModelId, getNSFW, getStyle, getTemplateId, getUseRoleStyle, setTemplateId, setStyle as setStyleSetting, setNSFW as setNSFWSetting, setSelectedModelId } from "../config/settings"
import { loadModelCatalog, chooseDefaultModel, type ModelEntry } from "../config/models"
import { buildSystemPrompt } from "../config/promptStyles"
import { useReducedMotion } from "../hooks/useReducedMotion"
import { getRoleById } from "../config/promptTemplates"
import { generateRoleStyleText } from "../config/styleEngine"
import MessageBubble from "../components/MessageBubble"
import Icon from "../components/Icon"
import TopBar from "../components/TopBar"
import { newId } from "../utils/id"
import { useConversations, type ChatMessage } from "../hooks/useConversations"
import ConversationsPanel from "../components/ConversationsPanel"
import { recommendedPolicyForRole } from "../config/rolePolicy"
import { getPreferRolePolicy } from "../config/featureFlags"

type Msg = { id: string; role: "user" | "assistant" | "system"; content: string; t: number }

export default function ChatView() {
  const conv = useConversations()
  const [convId, setConvId] = React.useState<string | null>(null)

  const [messages, setMessages] = React.useState<Msg[]>([])
  const [input, setInput] = React.useState("")
  const [streaming, setStreaming] = React.useState(false)
  const reducedMotion = useReducedMotion()
  const [autoScroll, setAutoScroll] = React.useState<boolean>(() => !reducedMotion)
  const [isAtBottom, setIsAtBottom] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [modelId, setModelId] = React.useState<string | null>(getSelectedModelId())
  const [modelReady, setModelReady] = React.useState(false)
  const [models, setModels] = React.useState<ModelEntry[]>([])
  const [cooldown, setCooldown] = React.useState<number>(0)
  const [switchedFrom, setSwitchedFrom] = React.useState<string | null>(null)
  const [panelOpen, setPanelOpen] = React.useState(false)

  const scrollRef = React.useRef<HTMLDivElement | null>(null)
  const abortRef = React.useRef<AbortController | null>(null)
  const bufferRef = React.useRef<string>("")
  const startTimeRef = React.useRef<number>(0)
  const assistantBufferRef = React.useRef<string>("")

  React.useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const list = await loadModelCatalog(false)
        if (!alive) return
        setModels(list)
        if (!modelId) {
          const next = chooseDefaultModel(list, { preferFree: true })
          setModelId(next)
        }
      } finally {
        if (alive) setModelReady(true)
      }
    })()
    return () => { alive = false }
  }, [])

  React.useEffect(() => {
    if (convId) return
    const first = conv.items[0]?.id
    if (first) { setConvId(first); setMessages(mapMsgs(conv.getMessages(first))) }
    else {
      const meta = conv.create("Neue Unterhaltung")
      setConvId(meta.id); setMessages([])
    }
  }, [conv.items.length]) // eslint-disable-line react-hooks/exhaustive-deps

  React.useEffect(() => {
    if (!autoScroll || !scrollRef.current || !isAtBottom) return
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages, streaming, autoScroll, isAtBottom])

  React.useEffect(() => {
    function onScroll() {
      const el = scrollRef.current
      if (!el) return
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 24
      setIsAtBottom(atBottom)
    }
    const el = scrollRef.current
    el?.addEventListener("scroll", onScroll)
    return () => el?.removeEventListener("scroll", onScroll)
  }, [])

  const hasKey = (() => { try { return !!localStorage.getItem("disa:openrouter:key") } catch { return false } })()

  function mapMsgs(list: ChatMessage[]): Msg[] {
    return list.map(m => ({ id: m.id, role: m.role === "user" ? "user" : "assistant", content: m.content, t: m.createdAt }))
  }

  function loadConversation(id: string) {
    setConvId(id)
    setMessages(mapMsgs(conv.getMessages(id)))
    setPanelOpen(false)
  }

  function push(role: Msg["role"], content: string) { setMessages((cur) => [...cur, { id: newId(), role, content, t: Date.now() }]) }

  function appendAssistantDelta(delta: string) {
    if (!delta) return
    assistantBufferRef.current += delta
    setMessages((cur) => {
      const next = cur.slice()
      const last = next[next.length - 1]
      if (!last || last.role !== "assistant") {
        next.push({ id: newId(), role: "assistant", content: delta, t: Date.now() })
      } else {
        last.content += delta
        last.t = Date.now()
      }
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
        if (delta) appendAssistantDelta(delta)
      } catch {
        if (data) appendAssistantDelta(data)
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

  function handleCommand(raw: string): boolean {
    const s = raw.trim()
    if (!s.startsWith("/")) return false
    const [cmd, ...rest] = s.slice(1).split(/\s+/)
    const arg = rest.join(" ").trim()
    if (cmd === "nsfw") { const on = ["on","true","1","an","ja"].includes(arg.toLowerCase()); setNSFWSetting(on); return true }
    if (cmd === "style") {
      const ok = ["neutral","blunt_de","concise","friendly","creative_light","minimal"]
      const key = arg as any
      if (ok.includes(key)) { setStyleSetting(key); return true }
      setError("Unbekannter Stil."); return true
    }
    if (cmd === "role") {
      const all = ["neutral","email_professional","sarcastic_direct","therapist_expert","legal_generalist","productivity_helper","ebay_coach","language_teacher","fitness_nutrition_coach","uncensored_expert","nsfw_roleplay","erotic_creative_author"]
      const found = all.find(id => id === arg) || all.find(id => id.includes(arg))
      if (found) { setTemplateId(found); return true }
      setError("Rolle nicht gefunden."); return true
    }
    if (cmd === "model") {
      const found = models.find(m => m.id === arg) || models.find(m => m.id.includes(arg))
      if (found) { setModelId(found.id); setSelectedModelId(found.id); return true }
      setError("Modell nicht gefunden."); return true
    }
    setError("Unbekannter Befehl."); return true
  }

  async function send() {
    setError(null)
    if (cooldown > 0) return
    const raw = input
    if (handleCommand(raw)) { setInput(""); return }
    const text = raw.trim()
    if (!text || streaming) return
    const hasKeyNow = hasKey
    if (!hasKeyNow) { setError("Kein OpenRouter API-Key gespeichert."); return }
    if (!convId) { const m = conv.create("Neue Unterhaltung"); setConvId(m.id) }

    let chosenModel = modelId
    const roleTmpl = getRoleById(getTemplateId())
    if (roleTmpl?.allow && roleTmpl.allow.length > 0 && chosenModel && !roleTmpl.allow.includes(chosenModel)) {
      const firstAllowed = models.find(m => roleTmpl.allow!.includes(m.id))?.id
      if (firstAllowed) {
        setSwitchedFrom(chosenModel!)
        chosenModel = firstAllowed
        setModelId(firstAllowed)
        setSelectedModelId(firstAllowed)
      }
    }

    if (chosenModel) {
      const prefer = getPreferRolePolicy()
      if (prefer) {
        const rec = recommendedPolicyForRole(roleTmpl?.id ?? null)
        if (rec !== "any") {
          const curSafety = models.find(m => m.id === chosenModel)?.safety ?? "moderate"
          if (curSafety !== rec) {
            let candidates = models.filter(m => (m.safety ?? "moderate") === rec)
            if (roleTmpl?.allow?.length) candidates = candidates.filter(m => roleTmpl.allow!.includes(m.id))
            const replacement = candidates[0]?.id
            if (replacement) {
              setSwitchedFrom(chosenModel)
              chosenModel = replacement
              setModelId(replacement)
              setSelectedModelId(replacement)
            }
          }
        }
      }
    }

    if (!chosenModel) { setError("Kein Modell ausgewählt/verfügbar."); return }

    setInput("")
    push("user", text)
    if (convId) conv.append(convId, { role: "user", content: text })

    setStreaming(true)
    bufferRef.current = ""
    assistantBufferRef.current = ""
    startTimeRef.current = performance.now()

    const base = buildSystemPrompt({ nsfw: getNSFW(), style: getStyle(), locale: "de-DE" })
    const roleStyle = generateRoleStyleText(roleTmpl?.id ?? null, getStyle(), getUseRoleStyle())
    const system = [roleTmpl?.system ?? "", base, roleStyle].filter(Boolean).join("\n\n")

    const body = {
      model: chosenModel,
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
            if (name === "AbortError") { setStreaming(false); return }
            const status = (err as any)?.status
            const retryAfter = Number((err as any)?.retryAfter || 0)
            if (status === 429) {
              const wait = retryAfter > 0 ? retryAfter : 15
              setError(`Rate Limit. Warte ${wait}s…`)
              setCooldown(wait)
              const t = window.setInterval(() => {
                setCooldown((s) => {
                  if (s <= 1) { window.clearInterval(t); setError(null); return 0 }
                  return s - 1
                })
              }, 1000)
            } else {
              setError(err instanceof Error ? err.message : String(err))
            }
            setStreaming(false)
          },
          onComplete: () => {
            try { parseSSE("\n\n", true) } catch {}
            setStreaming(false)
            const assistant = assistantBufferRef.current
            if (assistant && convId) conv.append(convId, { role: "assistant", content: assistant })
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
    <div className="min-h-[100svh] sm:h-[100svh] flex flex-col pb-[env(safe-area-inset-bottom)] bg-[radial-gradient(60%_60%_at_0%_0%,rgba(59,130,246,0.08),transparent_60%),radial-gradient(50%_60%_at_100%_0%,rgba(147,51,234,0.08),transparent_60%)]">
      <TopBar onOpenConversations={() => setPanelOpen(true)} />

      {!hasKey && (
        <div className="p-3">
          <InlineBanner tone="warn" title="Kein OpenRouter API-Key – Chat ist deaktiviert." actions={<a href="#/settings" className="underline">Key speichern</a>}>
            Du kannst die Oberfläche testen. Zum Chatten Key in den Einstellungen hinterlegen.
          </InlineBanner>
        </div>
      )}

      {switchedFrom && (
        <div className="px-3 pt-2">
          <InlineBanner
            tone="info"
            title="Rolle ↔ Modell"
            actions={<button className="underline" onClick={() => { if (switchedFrom) { setModelId(switchedFrom); setSelectedModelId(switchedFrom) } setSwitchedFrom(null) }}>Rückgängig</button>}
          >
            Modell wurde automatisch an die Rolle/Policy angepasst.
          </InlineBanner>
        </div>
      )}

      <div ref={scrollRef} className="flex-1 overflow-auto px-4 py-6 sm:px-6" role="log" aria-live="polite" aria-atomic="false">
        {/* Top-Gradient wie in Settings */}
        <div className="sticky top-0 -mt-6 h-6 bg-gradient-to-b from-white/60 dark:from-neutral-950/60 to-transparent z-10 pointer-events-none" />

        {messages.length === 0 && (
          <div className="mx-auto max-w-[860px] my-6">
            <div className="p-[2px] rounded-2xl bg-gradient-to-br from-blue-500/35 via-fuchsia-500/25 to-emerald-400/25">
              <div className="rounded-2xl border border-white/30 dark:border-white/10 bg-white/70 dark:bg-neutral-950/60 backdrop-blur px-5 py-5 shadow-sm">
                <div className="flex items-center gap-2 text-sm font-medium mb-2">
                  <Icon name="sparkles" width="18" height="18" />
                  <span>Neue Unterhaltung</span>
                </div>
                <div className="text-sm opacity-80">
                  Tippe unten. Befehle:
                  {" "}
                  <code className="px-1 rounded bg-neutral-100 dark:bg-neutral-800">/role</code>,
                  {" "}
                  <code className="px-1 rounded bg-neutral-100 dark:bg-neutral-800">/style</code>,
                  {" "}
                  <code className="px-1 rounded bg-neutral-100 dark:bg-neutral-800">/nsfw</code>,
                  {" "}
                  <code className="px-1 rounded bg-neutral-100 dark:bg-neutral-800">/model</code>.
                </div>
              </div>
            </div>
          </div>
        )}

        {messages.map((m) => {
          const actions = m.role === "user"
            ? [{ label: "Edit & resend", onClick: () => setInput(m.content) }]
            : [
                { label: "Weiter", onClick: () => { setInput("Bitte fahre fort."); } },
                { label: "Zusammenfassen", onClick: () => { setInput("Fasse die letzte Antwort in 5 Punkten zusammen."); } },
                { label: "To-Dos", onClick: () => { setInput("Extrahiere umsetzbare To-Dos als Markdown-Liste."); } }
              ]
          return (
            <MessageBubble key={m.id} role={m.role === "user" ? "user" : "assistant"} content={m.content} onCopy={copyMessage} actions={actions} />
          )
        })}
      </div>

      <div className="border-t border-neutral-200 dark:border-neutral-800 p-3 sm:p-4 bg-white/80 dark:bg-neutral-950/70 backdrop-blur">
        <div className="mx-auto max-w-[960px]">
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
            <div className="px-3 sm:px-4 py-2 border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-3 text-xs text-neutral-600 dark:text-neutral-400">
              <label className="flex items-center gap-1 cursor-pointer select-none">
                <input type="checkbox" checked={autoScroll} onChange={(e) => setAutoScroll(e.target.checked)} aria-label="Automatisches Scrollen aktivieren" />
                Auto-Scroll
              </label>
              <span className="opacity-60">Zeichen:</span>
              <span>{charCount}</span>
              {cooldown > 0 && (<><span className="opacity-60">•</span><span>Warte {cooldown}s</span></>)}
              <div className="ml-auto inline-flex items-center gap-2">
                <button type="button" onClick={() => { const meta = conv.create("Neue Unterhaltung"); loadConversation(meta.id) }} className="px-2 py-1 rounded border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800">Neu</button>
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
                placeholder="Nachricht eingeben… (/role, /style, /nsfw, /model verfügbar)"
                aria-label="Nachricht eingeben"
                className="flex-1 min-h-[72px] max-h-[240px] px-3 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-blue-500"
              />
              {!streaming ? (
                <button
                  type="button"
                  onClick={send}
                  disabled={!hasKey || !modelId || input.trim().length === 0 || cooldown > 0}
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

      <ConversationsPanel open={panelOpen} onClose={()=>setPanelOpen(false)} currentId={convId} onSelect={loadConversation} />
    </div>
  )
}
