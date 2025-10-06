import { Mic, RotateCcw, Send, Square, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// This component addresses the issue `04-composer-keyboard.md`
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
  const [isFocused, setIsFocused] = useState(false);
  const viewport = useVisualViewport();

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

  const shouldShowSend = !isLoading && value.trim() && canSend;
  const shouldShowStop = isLoading && onStop;
  const shouldShowRetry = canRetry && !isLoading && onRetry;

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

        <div
          className={cn(
            "relative flex items-end gap-2 rounded-2xl border border-white/15 bg-white/5 px-3.5 py-2.5 backdrop-blur-md backdrop-saturate-150 transition-colors",
            isFocused && "border-white/25",
            disabled && "cursor-not-allowed opacity-60",
          )}
        >
          <div className="flex-1">
            <Textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholder}
              disabled={disabled || isQuickstartLoading}
              readOnly={isQuickstartLoading}
              data-testid="composer-input"
              className={cn(
                "max-h-[200px] min-h-[44px] resize-none border-0 bg-transparent p-0 text-[15px] leading-relaxed text-white/90 placeholder:text-white/40 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0",
                isQuickstartLoading && "cursor-not-allowed text-white/80",
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
                className="min-h-touch-rec min-w-touch-rec rounded-full bg-white/5 text-corporate-text-secondary hover:bg-white/10 hover:text-corporate-text-primary"
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
                className="min-h-touch-rec min-w-touch-rec rounded-full bg-red-500/20 text-red-200 hover:bg-red-500/30 hover:text-corporate-text-onAccent"
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
                className="relative min-h-touch-rec min-w-touch-rec rounded-full bg-gradient-to-br from-purple-500 to-sky-500 text-corporate-text-onAccent shadow-lg transition-transform hover:scale-105 active:scale-95"
                disabled={disabled}
                title="Nachricht senden (Enter)"
                data-testid="composer-send"
              >
                <Send className="h-5 w-5" />
              </Button>
            )}

            {!shouldShowSend && !shouldShowStop && !shouldShowRetry && (
              <Button
                onClick={handleSend}
                size="icon"
                variant="ghost"
                className="bg-white/6 border-white/12 hover:bg-white/8 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-white/70 focus:ring-2 focus:ring-white/15"
                disabled={true}
                title="Nachricht eingeben, um zu senden"
                data-testid="composer-mic"
              >
                <Mic className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>

        <div className="mt-1 text-[12px] text-white/45">
          {isLoading
            ? "Antwort wird erstellt …"
            : "Enter zum Senden, Shift+Enter für Zeilenumbruch"}
        </div>
      </div>
    </div>
  );
}
