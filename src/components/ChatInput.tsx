import React from "react";

import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";

type Props = {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  onStop: () => void;
  busy: boolean;
};
export function ChatInput({ value, onChange, onSend, onStop, busy }: Props) {
  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!busy) onSend(); else onStop();
    }
  };
  return (
    <div className="p-3 border-t border-black/10 dark:border-white/10">
      <div className="flex items-center gap-2">
        <Input
          value={value}
          onChange={(e) => onChange((e.target as HTMLInputElement).value)}
          onKeyDown={onKey}
          placeholder="Nachricht eingeben…"
          aria-label="Nachricht"
        />
        {busy ? (
          <Button variant="outline" onClick={onStop} aria-label="Stopp" title="Stopp">Stop</Button>
        ) : (
          <Button onClick={onSend} aria-label="Senden" title="Senden" disabled={!value.trim()}>Senden</Button>
        )}
      </div>
    </div>
  );
}
