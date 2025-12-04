import { useEffect, useRef } from "react";

import { useVisualViewport } from "@/hooks/useVisualViewport";
import { Send } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { Textarea } from "@/ui/Textarea";

export interface UnifiedInputBarProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  isLoading?: boolean;
  className?: string;
}

export function UnifiedInputBar({
  value,
  onChange,
  onSend,
  isLoading = false,
  className,
}: UnifiedInputBarProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const viewport = useVisualViewport();

  // Auto-resize logic
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const newHeight = Math.min(Math.max(textarea.scrollHeight, 40), 180);
      textarea.style.height = `${newHeight}px`;
    }
  }, [value]);

  // Ensure input visibility when keyboard opens
  useEffect(() => {
    if (viewport.isKeyboardOpen && textareaRef.current) {
      const timer = setTimeout(() => {
        textareaRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "nearest",
        });
      }, 50);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [viewport.isKeyboardOpen]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      if (value.trim() && !isLoading) {
        onSend();
      }
    }
  };

  return (
    <div
      className={cn("w-full max-w-3xl mx-auto transition-[padding] px-3 sm:px-4", className)}
      style={{
        paddingBottom:
          "calc(max(var(--keyboard-offset, 0px), env(safe-area-inset-bottom, 0px)) + 0.5rem)",
      }}
    >
      {/* Minimalist Slate Input: Horizontal Line */}
      <div className="flex items-end gap-4 p-2">
        <div className="relative z-10 flex-1 pb-1">
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Formuliere deine Frage…"
            aria-label="Nachricht eingeben"
            className="input-chalk w-full min-h-[40px] max-h-[180px] resize-none px-2 py-2 placeholder:text-chalk-dim/50"
            rows={1}
            data-testid="composer-input"
          />
        </div>

        <div className="z-10 flex-shrink-0 pb-1">
          <button
            onClick={onSend}
            disabled={!value.trim() || isLoading}
            className={cn(
              "btn-chalk h-12 w-12 flex items-center justify-center",
              !value.trim() && "opacity-50 cursor-not-allowed",
            )}
            aria-label="Senden"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
