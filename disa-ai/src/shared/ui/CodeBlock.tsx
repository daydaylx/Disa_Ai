import { useState } from "react";

type Props = { code: string; lang?: string };

export function parseMessageToSegments(input: string): Array<{ type: "text" | "code"; value: string; lang?: string }> {
  const segs: Array<{ type: "text" | "code"; value: string; lang?: string }> = [];
  const re = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(input)) !== null) {
    if (m.index > last) segs.push({ type: "text", value: input.slice(last, m.index) });
    const lang = m[1] || undefined;
    const code = m[2] ?? "";
    segs.push({ type: "code", value: code, lang });
    last = re.lastIndex;
  }
  if (last < input.length) segs.push({ type: "text", value: input.slice(last) });
  return segs;
}

export default function CodeBlock({ code, lang }: Props) {
  const [copied, setCopied] = useState(false);
  async function onCopy() {
    try { await navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1200); } catch {}
  }
  return (
    <div className="group relative rounded-xl border border-border/50 bg-secondary/60 p-3">
      <div className="absolute right-2 top-2">
        <button onClick={onCopy} className="md-ripple rounded-md border border-border/60 bg-background/80 px-2 py-1 text-xs text-muted-foreground hover:text-foreground" title="Copy">
          {copied ? "Kopiert" : "Copy"}
        </button>
      </div>
      {lang && <div className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">{lang}</div>}
      <pre className="overflow-auto text-sm leading-relaxed"><code>{code}</code></pre>
    </div>
  );
}
