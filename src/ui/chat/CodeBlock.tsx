import React from "react";

import { Button } from "../primitives/Button";
export function CodeBlock({
  code,
  language = "text",
  wrap = true,
}: {
  code: string;
  language?: string;
  wrap?: boolean;
}) {
  function copy() {
    navigator.clipboard?.writeText(code).catch(() => {});
  }
  return (
    <div className="my-2">
      <div className="code-header">
        <span className="text-xs text-[hsl(var(--text-muted))]">{language}</span>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={copy}>
            Copy
          </Button>
        </div>
      </div>
      <pre
        className="code-body font-mono text-[12.5px] leading-5"
        style={{ whiteSpace: wrap ? ("pre-wrap" as const) : "pre", overflowX: "auto" }}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
}
