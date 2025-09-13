import * as React from 'react';
import { useMemo } from 'react';

import { cn } from "../../lib/utils/cn";
import { Button } from "../ui/Button";
import { Icon } from "../ui/Icon";

export type Role = "user" | "assistant" | "system";

export interface ChatMessage {
  id: string;
  role: Role;
  content: string;
}

interface MessageItemProps {
  msg: ChatMessage;
  onCopy?: (text: string) => void;
}

type Block =
  | { type: "text"; content: string }
  | { type: "code"; lang?: string | undefined; content: string };

function renderAsBlocks(text: string): Block[] {
  // ultra-simpler Markdown-Splitter: ```lang\ncode\n``` → Codeblock
  const parts: Block[] = [];
  const re = /```(\w+)?\n([\s\S]*?)```/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    const [full, lang, code] = m;
    if (m.index > last) {
      parts.push({ type: "text", content: text.slice(last, m.index) });
    }
    parts.push({ type: "code", lang: lang ?? undefined, content: (code ?? "").trimEnd() });
    last = m.index + full.length;
  }
  if (last < text.length) parts.push({ type: "text", content: text.slice(last) });
  return parts;
}

export const MessageItem: React.FC<MessageItemProps> = ({ msg, onCopy }) => {
  const blocks = useMemo(() => renderAsBlocks(msg.content), [msg.content]);
  const isUser = msg.role === "user";

  return (
    <div
      className={cn("msg rounded-xl p-3", isUser ? "msg-user ml-auto" : "msg-assistant mr-auto")}
      role="article"
      aria-label={isUser ? "Nachricht von dir" : "Antwort der KI"}
    >
      {blocks.map((b, i) =>
        b.type === "code" ? (
          <div key={i} className="codeblock my-2">
            <Button
              className="copy-btn"
              size="sm"
              variant="secondary"
              aria-label="Code kopieren"
              onClick={() => {
                void navigator.clipboard.writeText(b.content);
                onCopy?.(b.content);
              }}
            >
              <Icon name="copy" /> <span className="ml-2">Kopieren</span>
            </Button>
            <pre>
              <code>{b.content}</code>
            </pre>
          </div>
        ) : (
          <div key={i} className="whitespace-pre-wrap leading-relaxed">
            {b.content}
          </div>
        ),
      )}
    </div>
  );
};
