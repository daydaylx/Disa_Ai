import * as React from "react";

import { Button } from "./ui/button";
import { Icon } from "./ui/Icon";
import { Textarea } from "./ui/textarea";

interface ComposerProps {
  value: string;
  onChange?: (s: string) => void;
  onSend?: () => void;
  onStop?: () => void;
  streaming: boolean;
  canSend: boolean;
}

export function Composer({ value, onChange, onSend, onStop, streaming, canSend }: ComposerProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      if (value.trim() && canSend && !streaming) {
        onSend?.();
      }
    }
  };

  return (
    <div
      className="safe-px bg-bg-base/80 sticky z-40 pb-4 pt-2 backdrop-blur-lg"
      style={{ bottom: "var(--bottom-nav-h)" }}
    >
      <div className="mx-auto max-w-4xl">
        <div id="composer-help" className="sr-only">
          Geben Sie Ihre Nachricht ein und drücken Sie Senden oder Enter
        </div>
        <div className="flex items-end gap-2">
          <Textarea
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Schreiben Sie eine Nachricht..."
            rows={1}
            className="text-base"
            aria-label="Nachricht eingeben"
            aria-describedby="composer-help"
            data-testid="composer-input"
          />
          {!streaming ? (
            <Button
              onClick={onSend}
              disabled={!value.trim() || !canSend}
              size="lg"
              aria-label="Senden"
              data-testid="composer-send"
            >
              <Icon name="send" size={20} />
            </Button>
          ) : (
            <Button
              onClick={onStop}
              variant="destructive"
              size="lg"
              aria-label="Stopp"
              data-testid="composer-stop"
            >
              <Icon name="stop" size={20} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
