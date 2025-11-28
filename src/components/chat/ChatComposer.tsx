import { useEffect, useRef } from "react";

import { RotateCcw, Send, Square, Zap } from "@/lib/icons";
import { Button } from "@/ui/Button";
import { Textarea } from "@/ui/Textarea";

import { useVisualViewport } from "../../hooks/useVisualViewport";
import { cn } from "../../lib/utils";

interface ChatComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onStop?: () => void;
  onRetry?: () => void;
  isLoading?: boolean;
  canSend?: boolean;
  canRetry?: boolean;
  tokenCount?: number;
  maxTokens?: number;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  isQuickstartLoading?: boolean;
}

export function ChatComposer({
  value,
  onChange,
  onSend,
  onStop,
  onRetry,
  isLoading = false,
  canSend = true,
  canRetry = false,
  tokenCount,
  maxTokens,
  placeholder = "Notiere etwas...",
  disabled = false,
  className,
  isQuickstartLoading = false,
}: ChatComposerProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const viewport = useVisualViewport();

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
      if (value.trim() && canSend && !isLoading && !disabled) {
        onSend();
      }
    }
  };

  const handleFocus = () => {
     // Viewport adjustment if needed
  };

  const handleSend = () => {
    if (value.trim() && canSend && !isLoading && !disabled) {
      onSend();
    }
  };

  const handleStop = () => {
    if (isLoading && onStop) {
      onStop();
    }
  };

  const handleRetry = () => {
    if (canRetry && onRetry && !isLoading) {
      onRetry();
    }
  };

  const trimmedValue = value.trim();
  const shouldShowSend = !isLoading && trimmedValue && canSend;
  const shouldShowStop = isLoading && onStop;
  const shouldShowRetry = canRetry && !isLoading && onRetry;
  const isComposerDisabled = disabled || isQuickstartLoading;

  return (
    <div
      className={cn(
        "px-2 pt-2 transition-all duration-200",
        viewport.isKeyboardOpen
          ? "pb-[calc(1rem+var(--inset-b))]"
          : "pb-[calc(1rem+var(--inset-b))]",
        className,
      )}
    >
      <div className="mx-auto max-w-2xl space-y-2 text-ink-secondary">
        {(tokenCount !== undefined || maxTokens !== undefined) && (
          <div className="flex items-center justify-between text-[10px] sm:text-xs px-1 opacity-70">
            <div className="flex items-center gap-2">
              {tokenCount !== undefined && (
                <span className="inline-flex items-center gap-1 text-ink-primary font-medium">
                  <Zap className="h-3 w-3 text-accent" />
                  {tokenCount} Token
                </span>
              )}
            </div>
          </div>
        )}

        {/* INK THEME: Pinned Note Style */}
        <div className={cn(
            "flex items-end gap-2 bg-bg-surface border border-border-ink rounded-lg p-2 shadow-sm transition-colors focus-within:ring-1 focus-within:ring-accent/50 focus-within:border-accent",
            isComposerDisabled && "opacity-60 pointer-events-none"
        )}>
          <div className="flex-1">
            <Textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={handleFocus}
              placeholder={placeholder}
              aria-label={placeholder || "Nachricht schreiben"}
              disabled={isComposerDisabled}
              readOnly={isQuickstartLoading}
              data-testid="composer-input"
              className={cn(
                "w-full bg-transparent border-none text-ink-primary placeholder:text-ink-secondary/60 p-2 resize-none focus:ring-0",
                "text-[16px] leading-[1.5]",
                isQuickstartLoading && "text-ink-secondary cursor-not-allowed",
              )}
              style={{ height: "44px", maxHeight: "150px" }}
            />
          </div>

          <div className="flex items-center gap-1 mb-0.5">
            {shouldShowRetry && (
              <Button
                onClick={handleRetry}
                size="icon"
                variant="ghost"
                className="h-10 w-10 text-ink-secondary hover:text-accent"
                title="Antwort erneut generieren"
              >
                <RotateCcw className="h-5 w-5" />
              </Button>
            )}

            {shouldShowStop && (
              <Button
                onClick={handleStop}
                size="icon"
                variant="secondary"
                className="h-10 w-10 border-accent/30 text-accent hover:bg-accent/10"
                title="Stoppen"
              >
                <Square className="h-4 w-4 fill-current" />
              </Button>
            )}

            {shouldShowSend && (
              <Button
                onClick={handleSend}
                size="icon"
                variant="primary"
                className="h-10 w-10 rounded-md shadow-none"
                disabled={disabled}
                title="Senden"
                data-testid="composer-send"
              >
                <Send className="h-5 w-5 translate-x-px translate-y-px" />
              </Button>
            )}

            {!shouldShowRetry && !shouldShowStop && !shouldShowSend && (
              <div className="w-10 h-10" />
            )}
          </div>
        </div>

        <div className="text-ink-secondary mt-1 text-center text-[11px] opacity-70">
           {isLoading ? (
             <span className="animate-pulse">Disa schreibt...</span>
           ) : (
             <span>Enter zum Senden</span>
           )}
        </div>
      </div>
    </div>
  );
}
