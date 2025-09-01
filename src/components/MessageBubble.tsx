import React from "react"
import Icon from "./Icon"
import Avatar from "./Avatar"

type Action = { label: string; onClick: () => void }

type Props = {
  role: "user" | "assistant"
  content: string
  onCopy?: (text: string) => void
  actions?: Action[]
  /** Nur für letzte Assistant-Zeile beim Streamen */
  isStreamingTail?: boolean
}

export default function MessageBubble({ role, content, onCopy, actions, isStreamingTail }: Props) {
  const isAssistant = role === "assistant"
  return (
    <div className={`bubble-row bubble-appear ${isAssistant ? "bubble-row--assistant" : "bubble-row--user"}`}>
      {/* Avatar links für Assistant, rechts für User */}
      {isAssistant && <Avatar role="assistant" />}
      <div className={`bubble-border ${isAssistant ? "" : "bubble-border--user"}`}>
        <div className="bubble-inner">
          {isAssistant && (
            <div className="bubble-head">
              <Icon name="sparkles" width="14" height="14" />
              <span>Assistant</span>
            </div>
          )}
          <div>
            {content}
            {isAssistant && isStreamingTail ? <span className="caret" /> : null}
          </div>
        </div>
      </div>
      {!isAssistant && <Avatar role="user" />}

      <div className="bubble-actions">
        {onCopy && (
          <button className="action-chip" onClick={() => onCopy(content)} aria-label="Kopieren">Kopieren</button>
        )}
        {(actions ?? []).map((a, i) => (
          <button key={i} className="action-chip" onClick={a.onClick}>{a.label}</button>
        ))}
      </div>
    </div>
  )
}
