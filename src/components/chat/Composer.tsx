import React, { useEffect, useRef, useState } from "react";
import { Button } from "../ui/Button";
import { Textarea } from "../ui/Textarea";
import { cn } from "../../lib/utils/cn";

export interface ComposerProps {
  disabled?: boolean;
  loading?: boolean;
  onSend?: (text: string) => void;
  onStop?: () => void;
  placeholder?: string;
  rows?: number;
}

export const Composer: React.FC<ComposerProps> = ({
  disabled,
  loading,
  onSend,
  onStop,
  placeholder = "Nachricht eingeben…",
  rows = 3
}) => {
  const [value, setValue] = useState("");
  const ref = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = Math.min(el.scrollHeight, 220) + "px";
  }, [value]);

  const handleSend = () => {
    const text = value.trim();
    if (!text || disabled || loading) return;
    onSend?.(text);
    setValue("");
  };

  return (
    <div className={cn("chat-footer px-3 py-2 sticky-footer")}>
      <div className="mx-auto flex w-full max-w-5xl items-end gap-2">
        <Textarea
          ref={ref}
          data-testid="composer-input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className="flex-1"
          inputMode="text"
          enterKeyHint="send"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          disabled={disabled || loading}
        />
        {loading ? (
          <Button
            data-testid="composer-stop"
            variant="secondary"
            size="lg"
            aria-label="Stopp"
            onClick={onStop}
            leftIcon="stop"
          >
            Stoppen
          </Button>
        ) : (
          <Button
            data-testid="composer-send"
            variant="primary"
            size="lg"
            aria-label="Senden"
            onClick={handleSend}
            leftIcon="send"
            disabled={disabled}
          >
            Senden
          </Button>
        )}
      </div>
    </div>
  );
};
