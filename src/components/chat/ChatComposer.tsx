import { useEffect, useRef } from "react";

import { useVisualViewport } from "../../hooks/useVisualViewport";
import { RotateCcw, Send, Square, Zap } from "../../lib/icons";
import { cn } from "../../lib/utils";
import { IconButton } from "../ui/IconButton";
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
    ? "color-mix(in srgb, var(--accent) 55%, transparent)"
    : "rgba(139, 92, 246, 0.55)"; // Fallback for accent color

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
        "pointer-events-none sticky bottom-0 z-[var(--z-composer)] px-3 py-2 sm:py-3 transition-all duration-200",
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
      <div className="pointer-events-auto mx-auto w-full max-w-3xl space-y-3 text-fg-muted">
        {(tokenCount !== undefined || maxTokens !== undefined) && (
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              {tokenCount !== undefined && (
                <span className="inline-flex items-center gap-1 rounded-full border border-line bg-surface-glass backdrop-blur-sm px-3 py-1 text-fg-muted shadow-1">
                  <Zap className="h-4 w-4 shadow-1" />
                  {tokenCount} Token
                </span>
              )}
              {maxTokens !== undefined && (
                <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface-glass backdrop-blur-sm px-3 py-1 text-fg-muted shadow-1">
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
            "flex items-end gap-3 rounded-[1.75rem] border border-[var(--glass-border-soft)] bg-[color-mix(in_srgb,#0e182a_85%,transparent)] p-3 shadow-[0_35px_65px_rgba(0,0,0,0.55)] backdrop-blur-2xl",
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
                "text-style-body text-fg placeholder:text-fg-subtle max-h-[200px] min-h-[56px] resize-none border-0 bg-transparent px-3 py-2 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0",
                isQuickstartLoading && "text-fg-muted cursor-not-allowed",
              )}
            />
          </div>

          <div className="flex items-center gap-2">
            {shouldShowRetry && (
              <IconButton
                onClick={handleRetry}
                variant="secondary"
                title="Letzte Antwort erneut anfordern"
                aria-label="Letzte Antwort erneut anfordern"
              >
                <RotateCcw className="icon-std" />
              </IconButton>
            )}

            {shouldShowStop && (
              <IconButton
                onClick={handleStop}
                variant="danger"
                size="lg"
                title="Ausgabe stoppen"
                aria-label="Ausgabe stoppen"
                data-testid="composer-stop"
              >
                <Square className="icon-std" />
              </IconButton>
            )}

            {shouldShowSend && (
              <IconButton
                onClick={handleSend}
                size="lg"
                disabled={disabled}
                title="Nachricht senden (Enter)"
                aria-label="Nachricht senden"
                data-testid="composer-send"
              >
                <Send className="icon-std" />
              </IconButton>
            )}

            {!shouldShowRetry && !shouldShowStop && !shouldShowSend && (
              <span className="block h-12 w-12 min-h-[48px] min-w-[48px]" aria-hidden="true" />
            )}
          </div>
        </div>

        <div id="chat-composer-hint" className="mt-2 px-2 text-center text-[10px] text-fg-muted/80">
          <span className="inline-flex items-center justify-center gap-2">
            {(isLoading || isComposerDisabled) && (
              <span className="relative flex h-2 w-2">
                <span
                  className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                  style={{ background: pingBackground }}
                />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
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
