import React from "react";

import { Icon } from "./ui/Icon";

type Action = { label: string; onClick: () => void };

type Props = {
  role: "user" | "assistant";
  content: string;
  onCopy?: (text: string) => void;
  actions?: Action[];
  isStreamingTail?: boolean;
};

function MessageBubbleBase({ role, content, onCopy, actions, isStreamingTail }: Props) {
  const isAssistant = role === "assistant";
  return (
    <div
      className={`bubble-row ${isAssistant ? "bubble-row--assistant" : "bubble-row--user"} animate-in`}
    >
      {isAssistant && (
        <div className="avatar avatar--assistant" aria-hidden>
          A
        </div>
      )}
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
      {!isAssistant && (
        <div className="avatar avatar--user" aria-hidden>
          U
        </div>
      )}

      <div className="bubble-actions">
        {onCopy && (
          <button className="action-chip" onClick={() => onCopy(content)} aria-label="Kopieren">
            Kopieren
          </button>
        )}
        {(actions ?? []).map((a, i) => (
          <button key={i} className="action-chip" onClick={a.onClick}>
            {a.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default MessageBubbleBase;

// Named wrapper for compatibility with features/chat/ChatPanel
export function MessageBubble(props: { role: "user" | "assistant"; children?: React.ReactNode }) {
  const childText = (() => {
    const c = props.children as any;
    if (typeof c === "string") return c;
    if (Array.isArray(c)) return c.join("");
    return String(c ?? "");
  })();
  return <MessageBubbleBase role={props.role} content={childText} />;
}
