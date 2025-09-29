import { Mic, RotateCcw, Send, Square, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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
}: ChatComposerProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);

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
      className={cn("safe-pb px-2 pb-[calc(env(safe-area-inset-bottom)+1.5rem)] pt-4", className)}
    >
      <div className="mx-auto max-w-md space-y-4">
        {(tokenCount !== undefined || maxTokens !== undefined) && (
          <div className="flex items-center justify-between text-xs text-white/60">
            <div className="flex items-center gap-2">
              {tokenCount !== undefined && (
                <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-white/70">
                  <Zap className="h-3 w-3" />
                  {tokenCount} Token
                </span>
              )}
              {maxTokens !== undefined && (
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
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
          <div className="flex flex-wrap gap-2">
            {suggestionPrompts.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
                className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-white/70 transition hover:bg-white/20 hover:text-white"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        <div
          className={cn(
            "relative flex items-end gap-3 rounded-[28px] border border-white/10 bg-white/10 p-4 shadow-[0_20px_55px_rgba(7,15,31,0.55)] backdrop-blur-2xl transition-all",
            isFocused && "border-fuchsia-400/60 shadow-[0_28px_70px_rgba(192,38,211,0.45)]",
            disabled && "cursor-not-allowed opacity-50",
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
              disabled={disabled}
              className="min-h-[44px] resize-none border-0 bg-transparent p-0 text-[15px] leading-relaxed text-white placeholder:text-white/40 focus-visible:ring-0 focus-visible:ring-offset-0"
              style={{ height: "44px" }}
            />
          </div>

          <div className="flex items-center gap-2">
            {shouldShowRetry && (
              <Button
                onClick={handleRetry}
                size="sm"
                variant="ghost"
                className="h-10 w-10 rounded-full border border-white/10 bg-white/10 p-0 text-white/70 hover:bg-white/20 hover:text-white"
                title="Letzte Antwort erneut anfordern"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            )}

            {shouldShowStop && (
              <Button
                onClick={handleStop}
                size="sm"
                variant="ghost"
                className="h-10 w-10 rounded-full border border-red-400/70 bg-red-500/20 p-0 text-red-200 hover:bg-red-500/40 hover:text-white"
                title="Ausgabe stoppen"
              >
                <Square className="h-4 w-4" />
              </Button>
            )}

            {shouldShowSend && (
              <Button
                onClick={handleSend}
                size="sm"
                variant="ghost"
                className="relative h-12 w-12 rounded-full border-none bg-gradient-to-br from-fuchsia-500 via-purple-500 to-sky-500 p-0 text-white shadow-[0_22px_45px_rgba(168,85,247,0.55)] transition hover:translate-y-[-1px] hover:bg-transparent hover:shadow-[0_26px_55px_rgba(168,85,247,0.7)]"
                disabled={disabled}
                title="Nachricht senden (Enter)"
              >
                <Send className="h-5 w-5" />
              </Button>
            )}

            {!shouldShowSend && !shouldShowStop && !shouldShowRetry && (
              <Button
                onClick={handleSend}
                size="sm"
                variant="ghost"
                className="h-12 w-12 rounded-full border border-white/5 bg-white/5 p-0 text-white/30"
                disabled={true}
                title="Nachricht eingeben, um zu senden"
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
