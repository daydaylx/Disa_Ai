import { useEffect, useRef } from "react";

import { useVisualViewport } from "@/hooks/useVisualViewport";
import { cn } from "@/lib/utils";
import { Textarea } from "@/ui/Textarea";

export interface ChatInputBarProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  isLoading?: boolean;
  onQuickAction?: (action: string) => void;
  className?: string;
}

export function ChatInputBar({
  value,
  onChange,
  onSend,
  isLoading = false,
  className,
}: ChatInputBarProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const viewport = useVisualViewport();

  // Auto-resize logic
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const newHeight = Math.min(Math.max(textarea.scrollHeight, 44), 200);
      textarea.style.height = `${newHeight}px`;
    }
  }, [value]);

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
      className={cn("w-full transition-[padding]", className)}
      style={{
        paddingBottom: viewport.isKeyboardOpen
          ? `${Math.max(0, window.innerHeight - viewport.height)}px`
          : undefined,
      }}
    >
      {/* Main Input Container - Clean Paper Style */}
      <div className="relative flex bg-surface-1 rounded-xl border border-border-ink shadow-sm transition-shadow focus-within:shadow-md focus-within:border-ink-primary/30">
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Schreibe eine Nachricht..."
          className="flex-1 min-h-[40px] max-h-[180px] bg-transparent border-0 focus-visible:ring-0 px-3 py-2.5 sm:px-4 sm:py-3 resize-none text-base text-ink-primary placeholder:text-ink-tertiary leading-relaxed"
          rows={1}
          data-testid="composer-input"
        />
      </div>
    </div>
  );
}
