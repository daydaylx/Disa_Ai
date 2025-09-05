import React, { useState } from "react";
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
            "w-full min-h-[56px] max-h-[40dvh] p-4 pr-14 text-[15px] leading-5",
            "rounded-2xl glass outline-none resize-none",
            "placeholder:text-white/60"
          )}
          placeholder="Nachricht eingeben… (/role, /style, /nsfw, /model verfügbar)"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (!disabled) { onSend(text.trim()); setText(""); }
            }
          }}
        />
        <div className="absolute right-2 bottom-2">
          {loading ? (
            <button
              data-testid="composer-stop"
              className="tap pill px-3 py-2 bg-white/10 text-white text-sm"
              onClick={onStop}
            >
              Stop
            </button>
          ) : (
            <button
              data-testid="composer-send"
              className={cn(
                "tap pill btn-glow px-3 py-3",
                disabled && "opacity-60 pointer-events-none"
              )}
              onClick={() => { if (!disabled) { onSend(text.trim()); setText(""); } }}
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
