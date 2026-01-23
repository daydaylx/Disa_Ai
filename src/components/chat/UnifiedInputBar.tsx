import * as React from "react";

import { useVisualViewport } from "@/hooks/useVisualViewport";
import { Send } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/Button";

export interface UnifiedInputBarProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
}

export function UnifiedInputBar({
  value,
  onChange,
  onSend,
  isLoading = false,
  placeholder = "Schreibe eine Nachricht...",
  className,
}: UnifiedInputBarProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const viewport = useVisualViewport();

  // Auto-resize logic
  React.useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const newHeight = Math.min(Math.max(textarea.scrollHeight, 44), 160);
      textarea.style.height = `${newHeight}px`;
    }
  }, [value]);

  // Ensure input visibility when keyboard opens
  React.useEffect(() => {
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

  const handleSend = () => {
    if (value.trim()) {
      onSend();
    }
  };

  return (
    <div className={cn("w-full space-y-3", className)}>
      {/* Main Input Container - Single visual container, no double borders */}
      <div
        className={cn(
          "relative flex items-end gap-3 transition-all input-focus-animation pr-safe-right bg-surface-1/80 border border-white/8 rounded-2xl p-3",
          "focus-within:border-white/15 focus-within:bg-surface-1",
          "transition-all duration-200",
        )}
        aria-label="Eingabebereich"
      >
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            "flex-1 max-h-[160px] min-h-[44px] w-full resize-none bg-transparent px-3 py-2.5 text-[16px] text-ink-primary placeholder:text-ink-tertiary focus:outline-none leading-relaxed textarea-resize-transition",
          )}
          rows={1}
          data-testid="composer-input"
          aria-label="Nachricht eingeben"
        />

        {/* Send Button - Material Chip */}
        <Button
          onClick={handleSend}
          disabled={!value.trim() || isLoading}
          variant="primary"
          size="icon"
          className={cn(
            "flex-shrink-0 h-11 w-11 rounded-xl transition-all duration-200 mb-0.5 mr-1",
            !value.trim() &&
              !isLoading &&
              "opacity-40 bg-surface-2 text-ink-tertiary hover:bg-surface-2 shadow-sm",
            value.trim() &&
              !isLoading &&
              "bg-accent-chat text-white shadow-glow-sm hover:shadow-glow-md hover:scale-105 active:scale-100 animate-send-pulse",
          )}
          aria-label="Senden"
        >
          {isLoading ? (
            <div className="h-5 w-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send className={cn("h-5 w-5", value.trim() && "ml-0.5")} />
          )}
        </Button>
      </div>
    </div>
  );
}
