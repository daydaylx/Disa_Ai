import { useEffect, useRef } from "react";

import { useVisualViewport } from "@/hooks/useVisualViewport";
import { Send } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/Button";
import { Textarea } from "@/ui/Textarea";

import { ChatSettingsDropup } from "./ChatSettingsDropup";

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
      className={cn("w-full transition-[padding] bg-bg-page", className)}
      style={{
        paddingBottom: "max(var(--keyboard-offset, 0px), env(safe-area-inset-bottom, 0px))",
      }}
    >
      <div className="flex items-end gap-2 p-2 sm:gap-3 sm:p-3 md:max-w-3xl md:mx-auto">
        {/* Left: Settings Dropup */}
        <div className="flex-shrink-0 mb-1">
          <ChatSettingsDropup />
        </div>

        {/* Center: Text Input (Paper Style) */}
        <div className="relative flex-1 rounded-2xl bg-surface-1 border border-border-ink shadow-sm transition-shadow focus-within:shadow-md focus-within:border-ink-primary/30">
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Schreibe..."
            aria-label="Nachricht eingeben"
            className="w-full min-h-[40px] max-h-[180px] bg-transparent border-0 focus-visible:ring-0 px-4 py-3 resize-none text-base text-ink-primary placeholder:text-ink-tertiary leading-relaxed"
            rows={1}
            data-testid="composer-input"
          />
        </div>

        {/* Right: Send Button */}
        <div className="flex-shrink-0 mb-1">
          <Button
            onClick={onSend}
            disabled={!value.trim() || isLoading}
            size="icon"
            variant={value.trim() ? "primary" : "ghost"}
            className={cn(
              "h-10 w-10 rounded-full transition-all",
              value.trim() ? "shadow-md hover:shadow-lg" : "text-ink-tertiary hover:bg-black/5",
            )}
            aria-label="Senden"
          >
            <Send className={cn("h-5 w-5", value.trim() && "ml-0.5")} />
          </Button>
        </div>
      </div>
    </div>
  );
}
