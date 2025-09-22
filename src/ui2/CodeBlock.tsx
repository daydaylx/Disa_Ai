import React from "react";

import { useClipboard } from "./useClipboard";

export default function CodeBlock({ code, lang }: { code: string; lang: string | null }) {
  const { copied, copy } = useClipboard();

  return (
    <div className="group relative overflow-hidden rounded-lg border border-white/10 bg-black/35">
      <div className="flex items-center justify-between bg-white/5 px-3 py-1.5 text-[11px] uppercase tracking-wide text-muted/80">
        <span>{lang ?? "code"}</span>
        <button
          onClick={() => copy(code)}
          className="rounded-md border border-white/10 px-2 py-0.5 text-[11px] hover:bg-white/10"
        >
          {copied ? "Kopiert" : "Kopieren"}
        </button>
      </div>
      <pre className="overflow-x-auto whitespace-pre-wrap break-words p-3 font-mono text-[13px] leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}
