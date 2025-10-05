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

const suggestionPrompts = [
  "Schreibe eine freundliche Antwort auf diese E-Mail",
  "Fasse den heutigen Kundencall in Stichpunkten zusammen",
  "Entwirf eine Social-Media-Post-Idee zum Thema KI",
];

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

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    textareaRef.current?.focus();
  };

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

        {value.trim().length === 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-white/50">Vorschläge:</span>
            {suggestionPrompts.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
                className="min-h-touch-rec rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-corporate-text-secondary transition-colors hover:bg-white/10 hover:text-corporate-text-primary"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        <div
          className={cn(
            "relative flex items-end gap-2 rounded-2xl border border-white/10 bg-white/5 p-2 transition-colors",
            isFocused && "border-purple-500/50",
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
                "max-h-[200px] min-h-[40px] resize-none border-0 bg-transparent p-2 text-base leading-relaxed text-white placeholder:text-white/50 focus-visible:ring-0 focus-visible:ring-offset-0",
                isQuickstartLoading && "cursor-not-allowed text-white/80",
              )}
              style={{ height: "40px" }}
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
                className="min-h-touch-rec min-w-touch-rec rounded-full bg-white/5 text-corporate-text-subtle"
                disabled={true}
                title="Nachricht eingeben, um zu senden"
                data-testid="composer-mic"
              >
                <Mic className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-white/50">
          <div>
            {isLoading
              ? "Antwort wird erstellt …"
              : "Enter zum Senden • Shift+Enter für Zeilenumbruch"}
          </div>
          {value.length > 0 && <div>{value.length} Zeichen</div>}
        </div>
      </div>
    </div>
  );
}
