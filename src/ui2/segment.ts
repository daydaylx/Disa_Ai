export type Segment =
  | { type: "text"; content: string }
  | { type: "code"; lang: string | null; content: string };

const codeBlockRE = /```(\w+)?\n([\s\S]*?)```/g;

export function segmentMessage(raw: string): Segment[] {
  const out: Segment[] = [];
  let lastIndex = 0;
  let m: RegExpExecArray | null;

  while ((m = codeBlockRE.exec(raw)) !== null) {
    const [full, lang, body] = m;
    const start = m.index;
    if (start > lastIndex) {
      out.push({ type: "text", content: raw.slice(lastIndex, start) });
    }
    out.push({ type: "code", lang: lang ?? null, content: body.replace(/\n$/, "") });
    lastIndex = start + full.length;
  }
  if (lastIndex < raw.length) {
    out.push({ type: "text", content: raw.slice(lastIndex) });
  }
  return out;
}
