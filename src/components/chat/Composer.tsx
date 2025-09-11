import * as React from 'react';
import { useState } from 'react';

import { cn } from "../../lib/utils/cn";

export const Composer: React.FC<{
  loading?: boolean;
  onSend: (text: string) => void;
  onStop: () => void;
}> = ({ loading, onSend, onStop }) => {
  const [text, setText] = useState("");
  const disabled = loading || text.trim().length === 0;

  return (
    <div className="safe-pad safe-bottom py-3">
      <div className="relative flex items-end gap-2">
        <textarea
          data-testid="composer-input"
          className={cn(
            "max-h-[40dvh] min-h-[56px] w-full p-4 pr-14 text-[15px] leading-5",
            "resize-none rounded-[14px] outline-none",
            "bg-white/70 backdrop-blur-md border border-white/30",
            "placeholder:text-slate-500",
          )}
          placeholder="Nachricht eingeben… (/role, /style, /nsfw, /model verfügbar)"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (!disabled) {
                onSend(text.trim());
                setText("");
              }
            }
          }}
        />
        <div className="absolute bottom-2 right-2">
          {loading ? (
            <button
              data-testid="composer-stop"
              className="tap nav-pill px-3 py-2 text-sm"
              onClick={onStop}
            >
              Stop
            </button>
          ) : (
            <button
              data-testid="composer-send"
              className={cn("tap btn-primary px-3 py-3 rounded-[14px]", disabled && "pointer-events-none opacity-60")}
              onClick={() => {
                if (!disabled) {
                  onSend(text.trim());
                  setText("");
                }
              }}
              aria-label="Senden"
            >
              ✈️
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
