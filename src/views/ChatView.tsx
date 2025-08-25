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
import DevPanel from "../components/DevPanel"
import { newId } from "../utils/id"

type Msg = { id: string; role: "user" | "assistant" | "system"; content: string; t: number }

function estimateTokens(text: string): number { if (!text) return 0; return Math.ceil(text.length / 4) }
function formatUSD(n: number): string { return `$${n.toFixed(n >= 0.01 ? 2 : 4)}` }
function getQuickPrompts(roleId: string | null): string[] {
  if (roleId === "legal_generalist") return ["Bitte analysiere diesen Sachverhalt…", "Welche Risiken bestehen hier konkret?", "Formuliere einen Widerspruch in 5 Punkten."]
  if (roleId === "therapist_expert") return ["Ich stecke fest bei…", "Gib mir 3 Übungen für…", "Wie spreche ich Thema X an?"]
  if (roleId === "email_professional") return ["Schreibe eine kurze Mail: …", "Entschuldigung professionell formulieren", "Höfliche Erinnerung an Angebot"]
  if (roleId === "productivity_helper") return ["Baue mir eine Schrittfolge für …", "Erstelle eine kurze Checkliste zu …", "Gib mir eine Vorlage für …"]
  return ["Brainstorme 3 Optionen für …", "Erkläre mir kurz und knapp …", "Liste mir die Risiken von …", "Fasse das zusammen: …", "Welche nächsten Schritte?"]
}

export default function ChatView() {
  const [messages, setMessages] = React.useState<Msg[]>([])
  const [input, setInput] = React.useState("")
  const [streaming, setStreaming] = React.useState(false)
  const reducedMotion = useReducedMotion()
  const [autoScroll, setAutoScroll] = React.useState<boolean>(() => !reducedMotion)
  const [isAtBottom, setIsAtBottom] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [info, setInfo] = React.useState<string | null>(null)
  const [modelId, setModelId] = React.useState<string | null>(getSelectedModelId())
  const [modelReady, setModelReady] = React.useState(false)
  const [models, setModels] = React.useState<ModelEntry[]>([])
  const [cooldown, setCooldown] = React.useState<number>(0)
  const [switchedFrom, setSwitchedFrom] = React.useState<string | null>(null)
  const [estPrompt, setEstPrompt] = React.useState<number>(0)
  const [estCompletion, setEstCompletion] = React.useState<number>(0)
  const [estCost, setEstCost] = React.useState<number>(0)
  const [devOpen, setDevOpen] = React.useState(false)
  const [latSamples, setLatSamples] = React.useState<number[]>([])
  const [costSamples, setCostSamples] = React.useState<number[]>([])
  const [errorCount, setErrorCount] = React.useState(0)

  const scrollRef = React.useRef<HTMLDivElement | null>(null)
  const abortRef = React.useRef<AbortController | null>(null)
  const bufferRef = React.useRef<string>("")
  const completionSoFarRef = React.useRef<number>(0)
  const startTimeRef = React.useRef<number>(0)

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

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.altKey && (e.key === "d" || e.key === "D")) setDevOpen((v) => !v)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

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
        if (delta) {
          completionSoFarRef.current += estimateTokens(delta)
          appendAssistantChunk(delta)
        }
      } catch {
        if (data) {
          completionSoFarRef.current += estimateTokens(data)
          appendAssistantChunk(data)
        }
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

  function currentModel(): ModelEntry | null { if (!modelId) return null; return models.find(m => m.id === modelId) ?? null }

  function recalcEstimate(nextInput?: string) {
    const roleTmpl = getRoleById(getTemplateId())
    const base = buildSystemPrompt({ nsfw: getNSFW(), style: getStyle(), locale: "de-DE" })
    const roleStyle = generateRoleStyleText(roleTmpl?.id ?? null, getStyle(), getUseRoleStyle())
    const system = [roleTmpl?.system ?? "", base, roleStyle].filter(Boolean).join("\n\n")
    const hist = messages.filter(m => m.role !== "system").map(m => m.content).join("\n")
    const proposed = (nextInput ?? input).trim()
    const promptTokens = estimateTokens(system) + estimateTokens(hist) + estimateTokens(proposed)
    const model = currentModel()
    const price = model?.price
    const estOut = Math.max(estimateTokens(proposed) * 0.6 | 0, 150)
    const cost = price ? ((promptTokens / 1_000_000) * price.in + (estOut / 1_000_000) * price.out) : 0
    setEstPrompt(promptTokens)
    setEstCompletion(estOut)
    setEstCost(cost)
  }

  React.useEffect(() => { recalcEstimate() }, [input, messages, modelId])

  function showInfo(msg: string) { setInfo(msg); window.setTimeout(() => setInfo(null), 1800) }

  function handleCommand(raw: string): boolean {
    const s = raw.trim()
    if (!s.startsWith("/")) return false
    const [cmd, ...rest] = s.slice(1).split(/\s+/)
    const arg = rest.join(" ").trim()
    if (cmd === "nsfw") { const on = ["on","true","1","an","ja"].includes(arg.toLowerCase()); setNSFWSetting(on); showInfo(`NSFW ${on ? "aktiviert" : "deaktiviert"}`); return true }
    if (cmd === "style") {
      const ok = ["neutral","blunt_de","concise","friendly","creative_light","minimal"]
      const key = arg as any
      if (ok.includes(key)) { setStyleSetting(key); showInfo(`Stil: ${key}`); recalcEstimate(""); return true }
      setError("Unbekannter Stil."); return true
    }
    if (cmd === "role") {
      const all = ["neutral","email_professional","sarcastic_direct","therapist_expert","legal_generalist","productivity_helper","ebay_coach","language_teacher","fitness_nutrition_coach","uncensored_expert","nsfw_roleplay","erotic_creative_author"]
      const found = all.find(id => id === arg) || all.find(id => id.includes(arg))
      if (found) { setTemplateId(found); showInfo(`Rolle: ${found}`); recalcEstimate(""); return true }
      setError("Rolle nicht gefunden."); return true
    }
    if (cmd === "model") {
      const found = models.find(m => m.id === arg) || models.find(m => m.id.includes(arg))
      if (found) { setModelId(found.id); setSelectedModelId(found.id); showInfo(`Modell: ${found.id}`); recalcEstimate(""); return true }
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
    if (!hasKey) { setError("Kein OpenRouter API-Key gespeichert."); return }

    let chosenModel = modelId
    const roleTmpl = getRoleById(getTemplateId())
    if (roleTmpl?.allow && roleTmpl.allow.length > 0 && chosenModel && !roleTmpl.allow.includes(chosenModel)) {
      const firstAllowed = models.find(m => roleTmpl.allow!.includes(m.id))?.id
      if (firstAllowed) {
        setSwitchedFrom(chosenModel)
        chosenModel = firstAllowed
        setModelId(firstAllowed)
        setSelectedModelId(firstAllowed)
        showInfo(`Modell automatisch gewechselt → ${firstAllowed}`)
      }
    }
    if (!chosenModel) { setError("Kein Modell ausgewählt/verfügbar."); return }

    setInput("")
    push("user", text)
    setStreaming(true)
    bufferRef.current = ""
    completionSoFarRef.current = 0
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
              setErrorCount((n)=>n+1)
            }
            setStreaming(false)
          },
          onComplete: () => {
            try { parseSSE("\n\n", true) } catch {}
            setStreaming(false)
            const end = performance.now()
            const latency = end - startTimeRef.current
            setLatSamples(s => [...s.slice(-99), latency])
            const m = currentModel()
            const price = m?.price
            const realCost = price ? ((estPrompt / 1_000_000) * price.in + (completionSoFarRef.current / 1_000_000) * price.out) : 0
            setCostSamples(s => [...s.slice(-99), realCost])
          }
        }
      )
    } catch (e: any) {
      setError(e?.message ?? String(e))
      setErrorCount((n)=>n+1)
      setStreaming(false)
      abortRef.current = null
      return
    }
  }

  function stop() { try { abortRef.current?.abort() } catch {} ; abortRef.current = null; setStreaming(false) }
  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void send() } }
  async function copyMessage(text: string) { try { await navigator.clipboard.writeText(text) } catch {} }

  const charCount = input.length
  const model = currentModel()
  const price = model?.price
  const estCostText = price ? formatUSD(estCost) : "—"
  const estTokText = `${estPrompt} + ~${estCompletion}`

  return (
    <div className="min-h-[100svh] sm:h-[100svh] flex flex-col pb-[env(safe-area-inset-bottom)] bg-[radial-gradient(60%_60%_at_0%_0%,rgba(59,130,246,0.08),transparent_60%),radial-gradient(50%_60%_at_100%_0%,rgba(147,51,234,0.08),transparent_60%)]">
      <TopBar />

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
            Modell wurde automatisch an die Rolle angepasst.
          </InlineBanner>
        </div>
      )}

      <div ref={scrollRef} className="flex-1 overflow-auto px-4 py-6 sm:px-6" role="log" aria-live="polite" aria-atomic="false">
        {messages.length === 0 && (
          <div className="mx-auto max-w-[860px] rounded-2xl border border-neutral-200/70 dark:border-neutral-800/70 bg-white/60 dark:bg-neutral-900/60 backdrop-blur p-6 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-medium mb-2">
              <Icon name="sparkles" width="18" height="18" />
              <span>Neue Unterhaltung</span>
            </div>
            <div className="text-sm opacity-80 mb-3">Wähle einen Startprompt oder tippe unten. Befehle: <code className="px-1 rounded bg-neutral-100 dark:bg-neutral-800">/role</code>, <code className="px-1 rounded bg-neutral-100 dark:bg-neutral-800">/style</code>, <code className="px-1 rounded bg-neutral-100 dark:bg-neutral-800">/nsfw</code>, <code className="px-1 rounded bg-neutral-100 dark:bg-neutral-800">/model</code>. Dev mit Alt+D.</div>
            <div className="flex flex-wrap gap-2">
              {getQuickPrompts(getRoleById(getTemplateId())?.id ?? null).map((p, i) => (
                <button key={i} type="button" onClick={() => { setInput(p); }} className="text-xs px-2 py-1 rounded-full border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                  {p}
                </button>
              ))}
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
              <span className="opacity-60">•</span>
              <span>≈ Tokens: {estTokText}</span>
              <span className="opacity-60">•</span>
              <span>≈ Kosten: {price ? formatUSD(estCost) : "—"}</span>
              {cooldown > 0 && (<><span className="opacity-60">•</span><span>Warte {cooldown}s</span></>)}
              <div className="ml-auto inline-flex items-center gap-2">
                <button type="button" onClick={() => setDevOpen(v => !v)} className="px-2 py-1 rounded border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800">Dev</button>
                {info && <span className="text-blue-600 dark:text-blue-400">{info}</span>}
                <a href="#/settings" className="hidden sm:inline underline">Einstellungen</a>
              </div>
              {error && <span className="text-red-600 dark:text-red-400" role="alert">• {error}</span>}
            </div>

            <div className="px-3 sm:px-4 py-3 flex items-end gap-2">
              <label className="sr-only" htmlFor="chat-input">Nachricht eingeben</label>
              <textarea
                id="chat-input"
                value={input}
                onChange={(e) => { setInput(e.target.value); }}
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

      <DevPanel open={devOpen} onClose={()=>setDevOpen(false)} samples={latSamples} costs={costSamples} lastCost={costSamples[costSamples.length-1]||0} errors={errorCount} />
    </div>
  )
}
