import { useEffect, useRef } from "react";

import { useVisualViewport } from "@/hooks/useVisualViewport";
import { Send } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/Button";
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
      }, 150);
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
      <div className="relative flex items-end gap-2 rounded-2xl bg-surface-1 p-2 sm:gap-3 sm:p-3 before:content-[''] before:absolute before:inset-0 before:rounded-2xl before:shadow-[0_0_0_2px_var(--border-chalk)] before:pointer-events-none before:opacity-[var(--chalk-rough-opacity)] focus-within:before:shadow-[0_0_0_2px_var(--accent-primary),var(--chalk-glow)] focus-within:before:opacity-100 transition-all">
        <div className="relative flex-1">
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Schreibe eine Nachricht..."
            aria-label="Nachricht eingeben"
            className="w-full min-h-[40px] max-h-[180px] resize-none border-0 bg-transparent px-3 py-2 text-base leading-relaxed text-ink-primary placeholder:text-ink-tertiary placeholder:opacity-60 focus-visible:ring-0 sm:px-4 sm:py-3"
            rows={1}
            data-testid="composer-input"
          />
        </div>

        <div className="flex-shrink-0 relative z-10">
          <Button
            onClick={onSend}
            disabled={!value.trim() || isLoading}
            size="icon"
            variant={value.trim() ? "primary" : "ghost"}
            className={cn(
              "h-10 w-10 rounded-full transition-all relative",
              value.trim()
                ? "before:content-[''] before:absolute before:inset-0 before:rounded-full before:shadow-[0_0_0_2px_var(--accent-primary),var(--chalk-glow-strong)] before:opacity-80"
                : "text-ink-tertiary hover:bg-black/5",
            )}
            aria-label="Senden"
          >
            <Send className={cn("h-5 w-5 relative z-10", value.trim() && "ml-0.5")} />
          </Button>
        </div>
      </div>
    </div>
  );
}
