import React from "react"
import Icon from "./Icon"
import type { MouseEvent, ReactNode } from "react"

type Role = "user" | "assistant"
type Action = { label: string; onClick: () => void }
type Props = {
  role: Role
  content?: string
  children?: ReactNode
  onCopy?: (text: string) => void
  actions?: Action[]
}

function resolveText(content?: string, children?: ReactNode): string {
  if (typeof content === "string") return content
  if (typeof children === "string") return children
  return ""
}

function MessageBubble({ role, content, children, onCopy, actions }: Props) {
  const isUser = role === "user"
  const text = resolveText(content, children)
  const canCopy = text.length > 0

  async function handleCopy(e: MouseEvent<HTMLButtonElement>) {
    e.stopPropagation()
    if (!canCopy) return
    if (onCopy) { onCopy(text); return }
    try { await navigator.clipboard.writeText(text) } catch {}
  }

  return (
    <div className={`mb-4 ${isUser ? "text-right" : "text-left"}`}>
      <div className={`inline-flex items-start gap-2 max-w-[860px] ${isUser ? "flex-row-reverse" : ""}`}>
        {!isUser && <div className="select-none text-xs opacity-60 mt-1" aria-hidden="true">AI</div>}
        <div className={`rounded-2xl px-4 py-3 leading-relaxed whitespace-pre-wrap shadow-sm ${isUser ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white" : "bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800"}`}>
          {typeof content === "string" ? content : children}
          {Array.isArray(actions) && actions.length > 0 && (
            <div className={`mt-2 flex flex-wrap gap-1 ${isUser ? "text-white/90" : "text-neutral-700 dark:text-neutral-300"}`}>
              {actions.map((a, i) => (
                <button key={i} type="button" onClick={a.onClick} className={`text-xs px-2 py-1 rounded-full border ${isUser ? "border-white/40 hover:bg-white/10" : "border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800"}`}>
                  {a.label}
                </button>
              ))}
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={handleCopy}
          disabled={!canCopy}
          className={`self-start inline-flex items-center justify-center w-8 h-8 rounded-full border transition disabled:opacity-40 ${isUser ? "border-white/40 hover:bg-white/10 focus:outline-white" : "border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-blue-500"}`}
          aria-label="Nachricht kopieren"
          title="Nachricht kopieren"
        >
          <Icon name="copy" width="16" height="16" />
        </button>
      </div>
    </div>
  )
}

export default MessageBubble
export { MessageBubble }
