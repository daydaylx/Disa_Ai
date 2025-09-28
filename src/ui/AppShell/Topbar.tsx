import React from "react";

import { Badge } from "../primitives/Badge";
export function Topbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-[hsl(var(--text-muted)/0.2)] bg-[hsl(var(--bg-base)/0.55)] backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="u-ring h-7 w-7 rounded-full bg-[hsl(var(--accent-primary)/0.3)]" />
          <strong>Disa Orion</strong>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="accent">model: openrouter/*</Badge>
        </div>
      </div>
    </header>
  );
}
