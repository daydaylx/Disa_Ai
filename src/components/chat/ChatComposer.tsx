import { RotateCcw, Send, Square, Zap } from "lucide-react";
import { useEffect, useRef } from "react";

import { useVisualViewport } from "../../hooks/useVisualViewport";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

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
  placeholder = "Schreibe deine Nachricht … (Enter zum Senden, Shift+Enter für Zeilenumbruch)",
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
        "safe-bottom px-2 pt-4 transition-all duration-200",
        viewport.isKeyboardOpen ? "pb-4" : "pb-[calc(var(--inset-b)+1.5rem)]",
        className,
      )}
      style={{
        transform: viewport.isKeyboardOpen ? `translateY(-${viewport.offsetTop}px)` : undefined,
      }}
    >
      <div className="mx-auto max-w-md space-y-3 text-text-secondary">
        {(tokenCount !== undefined || maxTokens !== undefined) && (
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              {tokenCount !== undefined && (
                <span className="bg-surface-subtle border-border-hairline inline-flex items-center gap-1 rounded-full border px-3 py-1 text-text-secondary">
                  <Zap className="h-3 w-3" />
                  {tokenCount} Token
                </span>
              )}
              {maxTokens !== undefined && (
                <span className="bg-surface-subtle border-border-hairline inline-flex items-center gap-2 rounded-full border px-3 py-1 text-text-secondary">
                  Maximal: {maxTokens}
                </span>
              )}
            </div>
            {tokenCount !== undefined && maxTokens !== undefined && (
              <div>{Math.round((tokenCount / maxTokens) * 100)}% verwendet</div>
            )}
          </div>
        )}

        <div
          className={cn(
            "flex items-end gap-2 rounded-lg border border-border-subtle bg-surface-card p-2",
            isComposerDisabled && "cursor-not-allowed opacity-60",
          )}
        >
          <div className="flex-1">
            <Textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={isComposerDisabled}
              readOnly={isQuickstartLoading}
              data-testid="composer-input"
              className={cn(
                "text-text-primary placeholder:text-text-tertiary max-h-[200px] min-h-[48px] resize-none border-0 bg-transparent p-2 text-[15px] leading-relaxed focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0",
                isQuickstartLoading && "text-text-secondary cursor-not-allowed",
              )}
              style={{ height: "48px" }}
            />
          </div>

          <div className="flex items-center gap-2">
            {shouldShowRetry && (
              <Button
                onClick={handleRetry}
                size="icon"
                variant="ghost"
                className="h-12 w-12 text-text-secondary hover:bg-surface-subtle hover:text-text-primary"
                title="Letzte Antwort erneut anfordern"
                aria-label="Letzte Antwort erneut anfordern"
              >
                <RotateCcw className="h-5 w-5" />
              </Button>
            )}

            {shouldShowStop && (
              <Button
                onClick={handleStop}
                size="icon"
                variant="destructive"
                className="h-12 w-12"
                title="Ausgabe stoppen"
                aria-label="Ausgabe stoppen"
                data-testid="composer-stop"
              >
                <Square className="h-5 w-5" />
              </Button>
            )}

            {shouldShowSend && (
              <Button
                onClick={handleSend}
                size="icon"
                variant="brand"
                className="h-12 w-12 shadow-surface"
                disabled={disabled}
                title="Nachricht senden (Enter)"
                aria-label="Nachricht senden"
                data-testid="composer-send"
              >
                <Send className="h-5 w-5" />
              </Button>
            )}

            {!shouldShowRetry && !shouldShowStop && !shouldShowSend && (
              <span className="block h-12 w-12" aria-hidden="true" />
            )}
          </div>
        </div>

        <div className="text-text-secondary mt-1 text-center text-xs">
          <span className="inline-flex items-center justify-center gap-2">
            {(isLoading || isComposerDisabled) && (
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 bg-[color-mix(in_srgb,var(--color-brand-primary)_45%,transparent)]" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-brand-primary)]" />
              </span>
            )}
            <span>
              {isLoading
                ? "Antwort wird erstellt …"
                : isComposerDisabled
                  ? "Eingabe gesperrt, bitte warte einen Moment."
                  : "Enter zum Senden • Shift+Enter für Zeilenumbruch"}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
