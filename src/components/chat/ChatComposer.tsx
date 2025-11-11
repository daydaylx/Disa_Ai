import { useEffect, useRef } from "react";

import { useVisualViewport } from "../../hooks/useVisualViewport";
import { RotateCcw, Send, Square, Zap } from "../../lib/icons";
import { cn } from "../../lib/utils";
import { AuroraButton } from "../ui/aurora-button";
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
  const supportsColorMix =
    typeof CSS !== "undefined" && CSS.supports("color", "color-mix(in srgb, white 50%, black)");
  const pingBackground = supportsColorMix
    ? "color-mix(in srgb, var(--color-border-focus) 55%, transparent)"
    : "rgba(244, 93, 105, 0.45)";

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
    // iOS Safari keyboard handling - scroll input into view
    setTimeout(() => {
      textareaRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 300); // Wait for keyboard animation to complete
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
        "px-2 pt-3 sm:pt-4 transition-all duration-200",
        viewport.isKeyboardOpen
          ? "pb-[calc(0.75rem+max(env(safe-area-inset-bottom),0px))]"
          : "pb-[calc(1rem+max(env(safe-area-inset-bottom),0px))]",
        className,
      )}
      style={{
        transform: viewport.isKeyboardOpen ? `translateY(-${viewport.offsetTop}px)` : undefined,
        paddingLeft: "max(env(safe-area-inset-left), 0.5rem)",
        paddingRight: "max(env(safe-area-inset-right), 0.5rem)",
      }}
    >
      <div className="mx-auto max-w-md space-y-3 text-text-secondary">
        {(tokenCount !== undefined || maxTokens !== undefined) && (
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              {tokenCount !== undefined && (
                <span className="border-border-hairline inline-flex items-center gap-1 rounded-full border bg-[var(--surface-neumorphic-floating)] px-3 py-1 text-text-secondary">
                  <Zap className="h-3 w-3" />
                  {tokenCount} Token
                </span>
              )}
              {maxTokens !== undefined && (
                <span className="border-border-hairline inline-flex items-center gap-2 rounded-full border bg-[var(--surface-neumorphic-floating)] px-3 py-1 text-text-secondary">
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
            "flex items-end gap-2 rounded-[var(--radius-xl)] border border-[color-mix(in_srgb,var(--color-border-focus)_30%,transparent)] bg-[var(--surface-neumorphic-floating)] p-2 shadow-[var(--shadow-inset-subtle)] backdrop-blur-sm touch-target",
            isComposerDisabled && "cursor-not-allowed opacity-60",
          )}
        >
          <div className="flex-1">
            <Textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={handleFocus}
              placeholder={placeholder}
              disabled={isComposerDisabled}
              readOnly={isQuickstartLoading}
              data-testid="composer-input"
              aria-label="Nachricht an Disa AI eingeben"
              aria-describedby="chat-composer-hint"
              className={cn(
                "text-text-primary placeholder:text-text-tertiary max-h-[200px] min-h-[44px] resize-none border-0 bg-transparent p-2 text-[15px] sm:text-base leading-relaxed focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0",
                isQuickstartLoading && "text-text-secondary cursor-not-allowed",
              )}
              style={{ height: "44px" }}
            />
          </div>

          <div className="flex items-center gap-2">
            {shouldShowRetry && (
              <AuroraButton
                onClick={handleRetry}
                size="icon"
                variant="ghost"
                className="h-11 w-11 min-h-[44px] min-w-[44px] text-text-secondary hover:bg-[var(--surface-neumorphic-raised)] hover:text-text-primary touch-target"
                title="Letzte Antwort erneut anfordern"
                aria-label="Letzte Antwort erneut anfordern"
              >
                <RotateCcw className="h-5 w-5" />
              </AuroraButton>
            )}

            {shouldShowStop && (
              <AuroraButton
                onClick={handleStop}
                size="icon"
                variant="destructive"
                className="h-11 w-11 min-h-[44px] min-w-[44px] touch-target"
                title="Ausgabe stoppen"
                aria-label="Ausgabe stoppen"
                data-testid="composer-stop"
              >
                <Square className="h-5 w-5" />
              </AuroraButton>
            )}

            {shouldShowSend && (
              <AuroraButton
                onClick={handleSend}
                size="icon"
                variant="accent"
                className="h-11 w-11 min-h-[44px] min-w-[44px] shadow-neo-sm touch-target"
                disabled={disabled}
                title="Nachricht senden (Enter)"
                aria-label="Nachricht senden"
                data-testid="composer-send"
              >
                <Send className="h-5 w-5" />
              </AuroraButton>
            )}

            {!shouldShowRetry && !shouldShowStop && !shouldShowSend && (
              <span className="block h-11 w-11 min-h-[44px] min-w-[44px]" aria-hidden="true" />
            )}
          </div>
        </div>

        <div
          id="chat-composer-hint"
          className="text-text-secondary mt-1 text-center text-xs sm:text-sm px-2"
        >
          <span className="inline-flex items-center justify-center gap-2">
            {(isLoading || isComposerDisabled) && (
              <span className="relative flex h-2 w-2">
                <span
                  className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                  style={{ background: pingBackground }}
                />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-border-focus)]" />
              </span>
            )}
            <span className="leading-tight">
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
