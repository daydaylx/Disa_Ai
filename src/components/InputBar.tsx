import { Mic, Plus, SendHorizonal } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

import { Glass } from "./Glass";

interface InputBarProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export const InputBar: React.FC<InputBarProps> = ({ onSend, disabled = false }) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [message]);

  return (
    <form onSubmit={handleSubmit} className="mx-auto mb-4 w-full max-w-[720px] px-4">
      <Glass
        variant="standard"
        className={`rounded-[20px] p-2 transition-all duration-300 ${
          isFocused
            ? "border-[hsl(200,100%,75%,0.14)] shadow-[0_0_0_1px_rgba(255,255,255,0.14),0_0_12px_rgba(111,211,255,0.18)]"
            : "border-[var(--glass-stroke)]"
        } ${disabled ? "opacity-60" : ""}`}
      >
        <div className="flex items-end gap-2">
          <button
            type="button"
            className="rounded-full p-1 transition-colors hover:bg-[rgba(255,255,255,0.08)]"
            disabled={disabled}
          >
            <Plus size={18} />
          </button>

          <div className="min-h-[44px] flex-1">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Nachricht schreiben…"
              className="max-h-[150px] min-h-[40px] w-full resize-none border-none bg-transparent px-1 py-1 text-[var(--fg)] placeholder-[var(--fg-dim)] focus:outline-none focus:ring-0"
              aria-label="Nachricht schreiben"
              disabled={disabled}
              rows={1}
            />
          </div>

          <button
            type="button"
            className="rounded-full p-1 transition-colors hover:bg-[rgba(255,255,255,0.08)]"
            aria-label="Voice input"
            disabled={disabled}
          >
            <Mic size={18} />
          </button>

          <button
            type="submit"
            className={`rounded-full p-1 transition-colors ${
              message.trim()
                ? "bg-[var(--acc1)] text-[var(--bg0)] hover:bg-[hsl(204,100%,60%)]"
                : "bg-[rgba(255,255,255,0.08)]"
            } ${disabled || !message.trim() ? "cursor-not-allowed opacity-50" : ""}`}
            aria-label="Nachricht senden"
            disabled={disabled || !message.trim()}
          >
            <SendHorizonal size={18} />
          </button>
        </div>
      </Glass>
    </form>
  );
};
