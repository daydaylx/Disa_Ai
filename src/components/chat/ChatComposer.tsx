import { RotateCcw, Send, Square, Zap } from "lucide-react";
import { useEffect, useRef } from "react";

import { useStudio } from "../../app/state/StudioContext";
// This component addresses the issue `04-composer-keyboard.md`
import { useVisualViewport } from "../../hooks/useVisualViewport";
import { createRoleTint } from "../../lib/theme/glass";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { StaticGlassCard } from "../ui/StaticGlassCard";
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
  // Fix für Issue #73: Autosend-Funktionalität
  isQuickstartLoading?: boolean;
}

// Suggestion prompts removed to match new design

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
  const { accentColor } = useStudio();
  const tint = createRoleTint(accentColor);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset height to auto to get the correct scrollHeight
      textarea.style.height = "auto";
      // Set height based on scrollHeight, with min and max limits
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
  const isEmpty = trimmedValue.length === 0;
  const isComposerDisabled = disabled || isQuickstartLoading;
  const showHelperState = !isLoading && (isComposerDisabled || isEmpty);

  // Suggestion handling removed to match new design

  return (
    <div
      className={cn(
        "safe-bottom px-2 pt-4 transition-all duration-200",
        viewport.isKeyboardOpen
          ? "pb-4" // Less padding when keyboard is open
          : "pb-[calc(var(--inset-b)+1.5rem)]", // Normal padding
        className,
      )}
      style={{
        // Ensure composer stays above keyboard on mobile
        transform: viewport.isKeyboardOpen ? `translateY(-${viewport.offsetTop}px)` : undefined,
      }}
    >
      <div className="mx-auto max-w-md space-y-4">
        {(tokenCount !== undefined || maxTokens !== undefined) && (
          <div className="flex items-center justify-between text-xs text-white/60">
            <div className="flex items-center gap-2">
              {tokenCount !== undefined && (
                <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-corporate-text-onSurface">
                  <Zap className="h-3 w-3" />
                  {tokenCount} Token
                </span>
              )}
              {maxTokens !== undefined && (
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-corporate-text-secondary">
                  Maximal: {maxTokens}
                </span>
              )}
            </div>
            {tokenCount !== undefined && maxTokens !== undefined && (
              <div>{Math.round((tokenCount / maxTokens) * 100)}% verwendet</div>
            )}
          </div>
        )}

        <StaticGlassCard
          tint={tint}
          padding="sm"
          className={cn(
            "flex items-end gap-2",
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
                "max-h-[200px] min-h-[44px] resize-none border-0 bg-transparent p-0 text-[15px] leading-relaxed text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0",
                isQuickstartLoading && "cursor-not-allowed text-zinc-400",
              )}
              style={{ height: "44px" }}
            />
          </div>

          <div className="flex items-center gap-2">
            {shouldShowRetry && (
              <Button
                onClick={handleRetry}
                size="icon"
                variant="ghost"
                className="bg-white/8 hover:bg-white/12 min-h-touch-rec min-w-touch-rec rounded-full border border-white/10 text-zinc-300 hover:text-zinc-100"
                title="Letzte Antwort erneut anfordern"
              >
                <RotateCcw className="h-5 w-5" />
              </Button>
            )}

            {shouldShowStop && (
              <Button
                onClick={handleStop}
                size="icon"
                variant="ghost"
                className="min-h-touch-rec min-w-touch-rec rounded-full border border-red-300/30 bg-red-500/20 text-red-100 hover:bg-red-500/30"
                title="Ausgabe stoppen"
                data-testid="composer-stop"
              >
                <Square className="h-5 w-5" />
              </Button>
            )}

            {shouldShowSend && (
              <Button
                onClick={handleSend}
                size="icon"
                className="relative min-h-touch-rec min-w-touch-rec rounded-full border border-white/15 bg-white/15 text-zinc-100 shadow-[0_12px_30px_rgba(8,8,18,0.45)] transition-transform hover:scale-105 active:scale-95"
                disabled={disabled}
                title="Nachricht senden (Enter)"
                data-testid="composer-send"
              >
                <Send className="h-5 w-5" />
              </Button>
            )}

            {!shouldShowRetry && !shouldShowStop && !shouldShowSend && (
              <span className="block h-10 w-10" aria-hidden="true" />
            )}
          </div>
        </StaticGlassCard>

        <div className="mt-1 text-[12px] text-zinc-500">
          {isLoading
            ? "Antwort wird erstellt …"
            : showHelperState
              ? isComposerDisabled
                ? "Eingabe gesperrt, bitte warte einen Moment."
                : "Schreibe eine Nachricht, um zu starten."
              : "Enter zum Senden • Shift+Enter für Zeilenumbruch"}
        </div>
      </div>
    </div>
  );
}
