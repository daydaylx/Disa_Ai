import React, { useEffect, useRef, useState } from "react"
import { CHAT_FOCUS_EVENT, requestChatFocus, CHAT_NEWSESSION_EVENT } from "../utils/focusChatInput"

export interface ChatInputProps { onSubmit: (text: string) => void; onStop?: () => void; busy?: boolean }

export default function ChatInput({ onSubmit, onStop, busy }: ChatInputProps) {
  const [value, setValue] = useState("")
  const taRef = useRef<HTMLTextAreaElement | null>(null)
  const wrapRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => { const el = taRef.current; if (!el) return; el.style.height = "0px"; el.style.height = Math.min(el.scrollHeight, 6*24+16) + "px" }, [value])
  useEffect(() => {
    const focus = () => { setTimeout(() => taRef.current?.focus(), 10); wrapRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }) }
    const newSession = () => {} // optional nutzbar
    window.addEventListener(CHAT_FOCUS_EVENT, focus)
    window.addEventListener(CHAT_NEWSESSION_EVENT, newSession as EventListener)
    return () => { window.removeEventListener(CHAT_FOCUS_EVENT, focus); window.removeEventListener(CHAT_NEWSESSION_EVENT, newSession as EventListener) }
  }, [])

  const send = () => { const t = value.trim(); if (!t || busy) return; onSubmit(t); setValue(""); requestChatFocus() }
  const onKey: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send() } }

  return (
    <div ref={wrapRef} className="sticky bottom-0 z-10 bg-gradient-to-t from-black/60 via-black/40 to-transparent pt-2" style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 8px)" }}>
      <div className="mx-auto max-w-3xl px-3">
        <div className="flex items-end gap-2 rounded-2xl border border-white/10 bg-white/5 p-2">
          <textarea ref={taRef} value={value} onChange={(e)=>setValue(e.target.value)} onKeyDown={onKey}
            placeholder="/role, /style, /nsfw, /model verfügbar – kurz & konkret fragen"
            className="min-h-[40px] max-h-[176px] flex-1 resize-none bg-transparent outline-none placeholder-white/50" />
          {busy ? (
            <button onClick={onStop} className="shrink-0 rounded-xl px-3 py-2 bg-white/10 border border-white/10">Stop</button>
          ) : (
            <button onClick={send} disabled={!value.trim()} className="shrink-0 rounded-xl px-3 py-2 bg-white/10 border border-white/10 disabled:opacity-50">Senden</button>
          )}
        </div>
      </div>
    </div>
  )
}
