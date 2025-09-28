import React from "react";

import { CodeBlock } from "./CodeBlock";
import { MessageActions } from "./MessageActions";
import { Message } from "./types";

type Part = { type: "code" | "text"; content: string; lang?: string };
function splitCodeFences(text: string): Part[] {
  const out: Part[] = [];
  let i = 0;
  const fence = "```";
  while (i < text.length) {
    const start = text.indexOf(fence, i);
    if (start === -1) {
      out.push({ type: "text", content: text.slice(i) });
      break;
    }
    if (start > i) out.push({ type: "text", content: text.slice(i, start) });
    const langEnd = text.indexOf("\n", start + fence.length);
    if (langEnd === -1) {
      out.push({ type: "text", content: text.slice(start) });
      break;
    }
    const lang = text.slice(start + fence.length, langEnd).trim() || "text";
    const end = text.indexOf(fence, langEnd + 1);
    if (end === -1) {
      out.push({ type: "text", content: text.slice(start) });
      break;
    }
    out.push({ type: "code", lang, content: text.slice(langEnd + 1, end) });
    i = end + fence.length;
  }
  return out;
}

export function MessageItem({ msg, align = "left" }: { msg: Message; align?: "left" | "right" }) {
  const isAssistant = msg.role === "assistant";
  const isUser = msg.role === "user";
  return (
    <div className={align === "right" ? "flex justify-end" : "flex justify-start"}>
      <article
        className={
          "chat-bubble bubble max-w-[min(720px,92vw)] " +
          (isAssistant ? "bubble-assistant" : isUser ? "bubble-user" : "bubble-system")
        }
      >
        <div className="mb-1 flex items-center gap-2">
          <span className="badge badge-muted">{msg.role}</span>
          <time className="text-[11px] text-[hsl(var(--text-muted))]">
            {new Date(msg.createdAt).toLocaleTimeString()}
          </time>
        </div>
        {splitCodeFences(msg.content).map((part, i) =>
          part.type === "code" ? (
            <CodeBlock key={i} code={part.content} language={part.lang} />
          ) : (
            <p key={i} className="whitespace-pre-wrap text-[0.98rem] leading-6">
              {part.content}
            </p>
          ),
        )}
        <div className="mt-2">
          <MessageActions onCopy={() => navigator.clipboard?.writeText(msg.content)} />
        </div>
      </article>
    </div>
  );
}
