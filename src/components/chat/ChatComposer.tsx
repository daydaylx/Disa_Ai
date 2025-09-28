import { RotateCcw, Send, Square, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { cn } from "../../lib/utils";
import { Badge } from "../ui/badge";
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
  placeholder = "Type your message... (Enter to send, Shift+Enter for new line)",
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

  return (
    <div
      className={cn(
        "border-t border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-900",
        className,
      )}
    >
      <div className="mx-auto max-w-4xl">
        {/* Token Counter */}
        {(tokenCount !== undefined || maxTokens !== undefined) && (
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {tokenCount !== undefined && (
                <Badge variant="secondary" className="text-xs">
                  <Zap className="mr-1 h-3 w-3" />
                  {tokenCount} tokens
                </Badge>
              )}
              {maxTokens !== undefined && (
                <Badge variant="outline" className="text-xs">
                  Max: {maxTokens}
                </Badge>
              )}
            </div>
            {tokenCount !== undefined && maxTokens !== undefined && (
              <div className="text-xs text-neutral-500">
                {Math.round((tokenCount / maxTokens) * 100)}% used
              </div>
            )}
          </div>
        )}

        {/* Input Area */}
        <div
          className={cn(
            "relative flex items-end gap-3 rounded-lg border border-neutral-200 bg-white p-3 transition-colors dark:border-neutral-700 dark:bg-neutral-800",
            isFocused && "border-accent-500 ring-1 ring-accent-500",
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
              className="min-h-[44px] resize-none border-0 bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              style={{ height: "44px" }}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {shouldShowRetry && (
              <Button
                onClick={handleRetry}
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0"
                title="Retry last message"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            )}

            {shouldShowStop && (
              <Button
                onClick={handleStop}
                size="sm"
                variant="outline"
                className="h-8 w-8 border-semantic-danger p-0 text-semantic-danger hover:bg-semantic-danger hover:text-white"
                title="Stop generation"
              >
                <Square className="h-4 w-4" />
              </Button>
            )}

            {shouldShowSend && (
              <Button
                onClick={handleSend}
                size="sm"
                className="h-8 w-8 p-0"
                disabled={disabled}
                title="Send message (Enter)"
              >
                <Send className="h-4 w-4" />
              </Button>
            )}

            {!shouldShowSend && !shouldShowStop && !shouldShowRetry && (
              <Button
                onClick={handleSend}
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0"
                disabled={true}
                title="Type a message to send"
              >
                <Send className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Helper Text */}
        <div className="mt-2 flex items-center justify-between text-xs text-neutral-500">
          <div>
            {isLoading ? "Generating response..." : "Enter to send • Shift+Enter for new line"}
          </div>
          {value.length > 0 && <div>{value.length} characters</div>}
        </div>
      </div>
    </div>
  );
}
