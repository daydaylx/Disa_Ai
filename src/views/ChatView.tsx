import React from "react"
import InlineBanner from "../components/InlineBanner"
import { streamChatCompletion } from "../services/openrouter"
import { getSelectedModelId, getNSFW, getStyle, getTemplateId, setNSFW as setNSFWSetting, setSelectedModelId } from "../config/settings"
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
import HeroCard from "../components/HeroCard"
import QuickTiles from "../components/QuickTiles"
import Orb from "../components/Orb"
import ScrollToEndFAB from "../components/ScrollToEndFAB"
import InstallBanner from "../components/InstallBanner"
import Aurora from "../components/Aurora"
import ChatInput from "../components/ChatInput"
import { CHAT_NEWSESSION_EVENT } from "../utils/focusChatInput"

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
  const [panelOpen, setPanelOpen] = React.useState(false)
  const [compatWarning, setCompatWarning] = React.useState<string | null>(null)

  const scrollRef = React.useRef<HTMLDivElement | null>(null)
  const abortRef = React.useRef<AbortController | null>(null)
  const bufferRef = React.useRef<string>("")
  const assistantBufferRef = React.useRef<string>("")

  // NEWSESSION-Event: neue Unterhaltung starten
  React.useEffect(() => {
    const handler = () => {
      const meta = conv.create("Neue Unterhaltung");
      setConvId(meta.id);
      setMessages([]);
    };
    window.addEventListener(CHAT_NEWSESSION_EVENT, handler as unknown as EventListener);
    return () => window.removeEventListener(CHAT_NEWSESSION_EVENT, handler as unknown as EventListener);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Model-Katalog laden + Default wählen (nur 1x)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Erste Konversation herstellen/laden
  React.useEffect(() => {
    if (convId) return
    const first = conv.items[0]?.id
    if (first) { setConvId(first); setMessages(mapMsgs(conv.getMessages(first))) }
    else {
      const meta = conv.create("Neue Unterhaltung")
      setConvId(meta.id); setMessages([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conv.items.length])

  // Auto-Scroll ans Ende während Streaming
  React.useEffect(() => {
    if (!autoScroll || !scrollRef.current || !isAtBottom) return
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages, streaming, autoScroll, isAtBottom])

  // Bottom-Tracking
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
      const ok = [
        "neutral","blunt_de","concise","friendly","creative_light","minimal",
        "technical_precise","socratic","bullet","step_by_step","formal_de","casual_de",
        "detailed","no_taboos"
      ] as const
      const key = arg as any
      if (ok.includes(key)) { /* Style liegt im globalen Setting */ return true }
      setError("Unbekannter Stil."); return true
    }
    if (cmd === "role") {
      const all = ["neutral","email_professional","sarcastic_direct","therapist_expert","legal_generalist","productivity_helper","ebay_coach","language_teacher","fitness_nutrition_coach","uncensored_expert","nsfw_roleplay","erotic_creative_author"]
      const found = all.find(id => id === arg) || all.find(id => id.includes(arg))
      if (found) { /* Template-Id wird global verwaltet */ return true }
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
    setCompatWarning(null)

    // Nur Hinweis, kein Auto-Switch
    if (roleTmpl?.allow && roleTmpl.allow.length > 0 && chosenModel && !roleTmpl.allow.includes(chosenModel)) {
      const allowed = roleTmpl.allow.join(", ")
      setCompatWarning(`Rolle „${roleTmpl.name}“ empfiehlt Modelle: ${allowed}. Du nutzt: ${chosenModel}. Ich lasse es unverändert.`)
    }
    if (chosenModel) {
      const prefer = getPreferRolePolicy()
      if (prefer) {
        const rec = recommendedPolicyForRole(roleTmpl?.id ?? null)
        if (rec !== "any") {
          const curSafety = (models.find(m => m.id === chosenModel) as any)?.safety ?? "moderate"
          if (curSafety !== rec) {
            const msg = `Modell-Policy (${curSafety}) passt nicht zur empfohlenen Policy (${rec})${roleTmpl?.name ? ` der Rolle „${roleTmpl.name}“` : ""}. Ich ändere das Modell nicht.`
            setCompatWarning(prev => prev ? `${prev} ${msg}` : msg)
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

    const base = buildSystemPrompt({ nsfw: getNSFW(), style: getStyle(), locale: "de-DE" })
    const roleStyle = generateRoleStyleText(roleTmpl?.id ?? null, getStyle(), true /*getUseRoleStyle*/ as any)
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

  async function copyMessage(text: string) { try { await navigator.clipboard.writeText(text) } catch {} }

  return (
    <div className="min-h-[100svh] sm:h-[100svh] flex flex-col pb-[env(safe-area-inset-bottom)] app-gradient">
      <Aurora />
      <TopBar onOpenConversations={() => setPanelOpen(true)} />
      <InstallBanner />

      {!hasKey && (
        <div className="p-3">
          <InlineBanner tone="warn" title="Kein OpenRouter API-Key – Chat ist deaktiviert." actions={<a href="#/settings" className="underline">Key speichern</a>}>
            Du kannst die Oberfläche testen. Zum Chatten Key in den Einstellungen hinterlegen.
          </InlineBanner>
        </div>
      )}

      {compatWarning && (
        <div className="px-3 pt-2">
          <InlineBanner tone="info" title="Hinweis zu Rolle/Modell" actions={<button className="underline" onClick={() => setCompatWarning(null)}>Ausblenden</button>}>
            {compatWarning}
          </InlineBanner>
        </div>
      )}

      {/* Status-Leiste */}
      <div className="px-4 sm:px-6 pt-3">
        <div className="rounded-2xl glass px-4 py-2 flex items-center gap-3">
          <Orb thinking={streaming} size={36} />
          <div className="text-sm">
            {streaming ? "Denke…" : "Bereit."}
            {modelId && <span className="opacity-70"> · Modell: {modelId}</span>}
            {cooldown > 0 && <span className="opacity-70"> · Warte {cooldown}s</span>}
          </div>
          <div className="ml-auto flex items-center gap-3 text-sm">
            <label className="inline-flex items-center gap-2 select-none cursor-pointer">
              <input type="checkbox" className="accent-current" checked={autoScroll} onChange={(e)=>setAutoScroll(e.target.checked)} />
              Auto-Scroll
            </label>
          </div>
        </div>
      </div>

      {/* Nachrichtenliste */}
      <div ref={scrollRef} className="flex-1 overflow-auto px-4 py-6 sm:px-6" role="log" aria-live="polite" aria-atomic="false">
        <div className="sticky top-0 -mt-6 h-6 bg-gradient-to-b from-white/60 dark:from-neutral-950/60 to-transparent z-10 pointer-events-none" />

        {messages.length === 0 && (
          <div className="mx-auto max-w-[860px] my-6 space-y-4">
            <HeroCard onStart={() => setInput("Erkläre mir kurz und klar …")} />
            <QuickTiles onPick={(p) => setInput(p)} />
          </div>
        )}

        {messages.map((m, idx) => {
          const actions = m.role === "user"
            ? [{ label: "Edit & resend", onClick: () => setInput(m.content) }]
            : [
                { label: "Weiter", onClick: () => { setInput("Bitte fahre fort."); } },
                { label: "Zusammenfassen", onClick: () => { setInput("Fasse die letzte Antwort in 5 Punkten zusammen."); } },
                { label: "To-Dos", onClick: () => { setInput("Extrahiere umsetzbare To-Dos als Markdown-Liste."); } }
              ]
          const isTail = streaming && idx === messages.length - 1 && m.role === "assistant"
          return (
            <MessageBubble key={m.id} role={m.role === "user" ? "user" : "assistant"} content={m.content} onCopy={copyMessage} actions={actions} isStreamingTail={isTail} />
          )
        })}

        {/* Fehler-/Hinweiszeile (klein, unaufdringlich) */}
        {error && (
          <div className="mt-4 text-sm opacity-80">
            <span className="inline-flex items-center gap-2 rounded-md px-2 py-1 bg-red-500/10 border border-red-500/30">
              <Icon name="info" width="14" height="14" />
              <span>• {error}</span>
            </span>
          </div>
        )}
      </div>

      {/* EINZIGER Composer: der neue ChatInput */}
      <ChatInput onSubmit={(text) => { setInput(text); void send(); }} onStop={stop} busy={streaming} />

      <ScrollToEndFAB visible={!isAtBottom} onClick={() => { const el = scrollRef.current; if (el) el.scrollTop = el.scrollHeight }} />
      <ConversationsPanel open={panelOpen} onClose={()=>setPanelOpen(false)} currentId={convId} onSelect={loadConversation} />
    </div>
  )
}
