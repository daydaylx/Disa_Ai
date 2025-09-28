import React, { useState } from "react";

import { Button } from "../primitives/Button";
import { TextArea } from "../primitives/TextArea";
export function ComposerDock({
  onSend,
  disabled,
  tokenCount,
}: {
  onSend: (text: string) => void;
  disabled?: boolean;
  tokenCount?: number;
}) {
  const [value, setValue] = useState("");
  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim()) {
        onSend(value.trim());
        setValue("");
      }
    }
  }
  return (
    <footer className="sticky bottom-0 z-30 border-t border-[hsl(var(--text-muted)/0.2)] bg-[hsl(var(--bg-base)/0.65)] backdrop-blur-md">
      <div className="mx-auto max-w-[900px] px-4 py-3">
        <div className="u-card u-glass u-ring p-2">
          <div className="flex items-end gap-2">
            <TextArea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nachricht eingeben… (Shift+Enter = Zeilenumbruch)"
            />
            <Button
              className="tap-target"
              disabled={disabled || !value.trim()}
              onClick={() => {
                onSend(value.trim());
                setValue("");
              }}
            >
              Senden
            </Button>
          </div>
          <div className="mt-2 flex items-center justify-between text-[12px] text-[hsl(var(--text-muted))]">
            <div>Tokens: {tokenCount ?? 0}</div>
            <div className="flex items-center gap-2">
              <span className="badge badge-accent">/help</span>
              <span className="badge badge-muted">Model: auto</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
