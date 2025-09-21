import * as React from "react";

import CodeBlock from "../CodeBlock";

type Segment = { type: "code"; content: string; lang?: string } | { type: "text"; content: string };

type Props = {
  content: string;
};

function parseSegments(input: string): Segment[] {
  const segments: Segment[] = [];
  const pattern = /```([\w-]+)?\s*\n([\s\S]*?)```/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(input)) !== null) {
    const [full, languageRaw, code] = match;
    const start = match.index;

    if (start > lastIndex) {
      segments.push({ type: "text", content: input.slice(lastIndex, start) });
    }

    const lang = languageRaw?.trim() || undefined;
    const trimmedCode = code.replace(/\s*$/, "");
    segments.push({ type: "code", content: trimmedCode, lang });
    lastIndex = start + full.length;
  }

  if (lastIndex < input.length) {
    segments.push({ type: "text", content: input.slice(lastIndex) });
  }

  if (segments.length === 0) {
    return [{ type: "text", content: input }];
  }

  return segments;
}

export function ChatMessageContent({ content }: Props) {
  const segments = React.useMemo(() => parseSegments(content), [content]);

  return (
    <div className="chat-message__body">
      {segments.map((segment, index) => {
        if (segment.type === "code") {
          return (
            <CodeBlock
              key={`code-${index}`}
              code={segment.content}
              lang={segment.lang}
              className="chat-message__code"
            />
          );
        }

        return (
          <p key={`text-${index}`} className="chat-message__text">
            {segment.content}
          </p>
        );
      })}
    </div>
  );
}

export default ChatMessageContent;
