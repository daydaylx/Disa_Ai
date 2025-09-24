import React from "react";

type Props = {
  role: "user" | "assistant" | "system";
  content: string;
};

export const MessageItem: React.FC<Props> = ({ role, content }) => {
  const nodes = React.useMemo(() => renderText(content), [content]);

  return (
    <div className={role === "user" ? "text-white" : "text-text-secondary"}>
      <div className="mb-1 text-[11px] uppercase tracking-wider opacity-60">{role}</div>
      <div className="space-y-2">{nodes}</div>
    </div>
  );
};

/** Minimaler Text-Renderer:
 *  - \n -> <br />
 *  - URLs -> <a>
 *  - Inline `code` -> <code>-Span (ohne Markdown-Parser)
 */
function renderText(s: string): React.ReactNode[] {
  const paragraphChunks = s.split(/\n{2,}/g); // Doppelte Zeilenumbrüche = Absatz
  return paragraphChunks.map((para, idx) => (
    <p key={idx} className="whitespace-pre-wrap">
      {renderInline(para)}
    </p>
  ));
}

function renderInline(s: string): React.ReactNode[] {
  // Split nach Inline-Backticks `code`
  const parts = s.split(/(`[^`]+`)/g);
  return parts.map((p, i) => {
    if (p.startsWith("`") && p.endsWith("`")) {
      const inner = p.slice(1, -1);
      return (
        <code
          key={i}
          className="rounded-md border border-white/15 bg-white/10 px-1 py-[1px] text-[0.85em]"
        >
          {inner}
        </code>
      );
    }
    return <React.Fragment key={i}>{autoLink(p)}</React.Fragment>;
  });
}

function autoLink(text: string): React.ReactNode[] {
  const urlRe = /\b(https?:\/\/[^\s<>"')]+)\b/g;
  const out: React.ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = urlRe.exec(text)) !== null) {
    const start = m.index;
    const url = m[1];
    if (start > last) out.push(text.slice(last, start));
    out.push(
      <a
        key={start}
        href={url}
        target="_blank"
        rel="nofollow noopener noreferrer"
        className="underline decoration-white/40 hover:decoration-white"
      >
        {url}
      </a>,
    );
    last = urlRe.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}
