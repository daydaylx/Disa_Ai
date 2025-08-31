import React from "react"
import Icon from "./Icon"

type Action = { label: string; onClick: () => void }
type Props = {
  role: "user" | "assistant"
  content: string
  onCopy?: (text: string) => void
  actions?: Action[]
}

/** Optisch an Settings-Card angelehnt, minimal invasiv. */
export default function MessageBubble({ role, content, onCopy, actions = [] }: Props) {
  const isAssistant = role === "assistant"
  return (
    <div className="group mx-auto max-w-[860px] my-2">
      <div className={isAssistant
        ? "p-[2px] rounded-2xl bg-gradient-to-br from-blue-500/30 via-fuchsia-500/25 to-emerald-400/25"
        : "p-[2px] rounded-2xl bg-neutral-200/40 dark:bg-neutral-800/40"}>
        <div className={isAssistant
          ? "rounded-2xl border border-white/30 dark:border-white/10 bg-white/65 dark:bg-neutral-950/60 backdrop-blur px-4 py-3"
          : "rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/75 dark:bg-neutral-900/70 backdrop-blur px-4 py-3"}>
          <div className="flex items-center gap-2 mb-1 text-xs text-neutral-600 dark:text-neutral-400">
            <span className="inline-flex items-center gap-1">
              <Icon name={isAssistant ? "sparkles" : "role"} width="14" height="14" />
              {isAssistant ? "Assistant" : "Du"}
            </span>
            <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-1">
              {onCopy && (
                <button
                  className="px-2 py-1 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  onClick={() => onCopy(content)}
                >
                  Kopieren
                </button>
              )}
              {actions.map((a, i) => (
                <button
                  key={i}
                  onClick={a.onClick}
                  className="px-2 py-1 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>
          <div className="text-sm leading-relaxed whitespace-pre-wrap">
            {content || "\u00A0"}
          </div>
        </div>
      </div>
    </div>
  )
}
