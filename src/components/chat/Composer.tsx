import * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import { hapticFeedback } from "../../lib/touch/haptics";
import { cn } from "../../lib/utils/cn";
// import { VoiceButton } from "./VoiceButton"; // Temporarily disabled

const MAX_TEXTAREA_LINES = 8;
const LINE_HEIGHT = 20;
const MIN_HEIGHT = 56;

export const Composer: React.FC<{
  loading?: boolean;
  onSend: (text: string) => void;
  onStop: () => void;
  error?: string | null;
  onClearError?: () => void;
}> = ({ loading, onSend, onStop, error, onClearError }) => {
  const [text, setText] = useState(() => {
    // Load prefilled text from QuickStart selection
    try {
      const prefilled = localStorage.getItem("disa:prefill");
      if (prefilled) {
        localStorage.removeItem("disa:prefill");
        return prefilled;
      }
    } catch {
      /* ignore */
    }
    return "";
  });
  const [textareaHeight, setTextareaHeight] = useState(MIN_HEIGHT);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const composerRef = useRef<HTMLDivElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  const [isComposing, setIsComposing] = useState(false);
  const [_platformShortcut, setPlatformShortcut] = useState("Strg");
  const disabled = loading || text.trim().length === 0;

  // Auto-resize textarea based on content
  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Reset height to measure scrollHeight
    textarea.style.height = `${MIN_HEIGHT}px`;

    const scrollHeight = textarea.scrollHeight;
    const lineCount = Math.floor((scrollHeight - 16) / LINE_HEIGHT); // 16px for padding
    const maxHeight = MAX_TEXTAREA_LINES * LINE_HEIGHT + 16;

    if (lineCount <= MAX_TEXTAREA_LINES) {
      setTextareaHeight(Math.max(scrollHeight, MIN_HEIGHT));
    } else {
      setTextareaHeight(maxHeight);
    }
  }, []);

  // Adjust height when text changes
  useEffect(() => {
    adjustHeight();
  }, [text, adjustHeight]);

  // Handle keyboard visibility and scrolling
  useEffect(() => {
    const handleResize = () => {
      if (textareaRef.current && document.activeElement === textareaRef.current) {
        setTimeout(() => {
          textareaRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }, 100);
      }
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", handleResize);
      return () => window.visualViewport?.removeEventListener("resize", handleResize);
    } else {
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  // Focus management after send
  useEffect(() => {
    if (!loading && text === "") {
      textareaRef.current?.focus();
    }
  }, [loading, text]);

  useEffect(() => {
    if (typeof navigator === "undefined") return;
    const isApple = /Mac|iPhone|iPad|iPod/i.test(navigator.platform || navigator.userAgent);
    setPlatformShortcut(isApple ? "⌘" : "Strg");
  }, []);

  const handleSend = useCallback(() => {
    if (!disabled) {
      hapticFeedback.success();
      onSend(text.trim());
      setText("");
      onClearError?.();
    }
  }, [disabled, text, onSend, onClearError]);

  const handleStop = useCallback(() => {
    hapticFeedback.warning();
    onStop();
  }, [onStop]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (isComposing) return;
      if (e.key === "Enter") {
        if (e.shiftKey) {
          // Shift+Enter: Insert line break (default behavior)
          return;
        } else if (e.metaKey || e.ctrlKey) {
          // Cmd/Ctrl+Enter: Always send
          e.preventDefault();
          handleSend();
        } else {
          // Plain Enter: Send if not disabled
          e.preventDefault();
          handleSend();
        }
      }
    },
    [handleSend, isComposing],
  );

  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setText(e.target.value);
      if (error) {
        onClearError?.();
      }
    },
    [error, onClearError],
  );

  const handleComposition = useCallback(
    (event: React.CompositionEvent<HTMLTextAreaElement>) => {
      if (event.type === "compositionstart") {
        setIsComposing(true);
      }
      if (event.type === "compositionend") {
        setIsComposing(false);
        // ensure latest text measured after IME commit
        adjustHeight();
      }
    },
    [adjustHeight],
  );

  // Voice handlers - temporarily disabled
  // const _handleVoiceTranscript = useCallback((transcript: string) => {
  //   setText(transcript);
  //   textareaRef.current?.focus();
  // }, []);

  // const _handleVoiceError = useCallback((error: string) => {
  //   console.warn("Voice recognition error:", error);
  // }, []);

  return (
    <div
      ref={composerRef}
      className="glass sticky bottom-0 border-t p-4"
      style={{
        paddingBottom: `calc(16px + env(safe-area-inset-bottom))`,
      }}
    >
      {/* Error Message */}
      {error && (
        <div
          ref={errorRef}
          id="composer-error"
          className="mb-3 rounded border border-error/50 bg-error/10 p-3"
          role="alert"
          aria-live="assertive"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm text-error">{error}</p>
            <button
              type="button"
              className="touch-target ml-2 rounded bg-error/20 px-2 py-1 text-xs text-error transition-colors hover:bg-error/30"
              onClick={handleSend}
              disabled={disabled}
            >
              Wiederholen
            </button>
          </div>
        </div>
      )}

      <div className="flex items-end gap-3">
        <div className="flex-1">
          <textarea
            ref={textareaRef}
            data-testid="composer-input"
            className="w-full resize-none rounded-full border border-neutral-900 bg-surface-secondary px-4 py-3 text-base leading-6 text-foreground placeholder-neutral-600 transition-colors focus:border-accent-500 focus:outline-none"
            style={{ height: `${textareaHeight}px` }}
            placeholder="Nachricht eingeben…"
            value={text}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            onFocus={() => hapticFeedback.select()}
            inputMode="text"
            autoCapitalize="sentences"
            autoCorrect="on"
            aria-label="Nachricht eingeben"
            aria-describedby={error ? "composer-error" : undefined}
            aria-invalid={!!error}
            onCompositionStart={handleComposition}
            onCompositionEnd={handleComposition}
          />
        </div>

        {loading ? (
          <button
            data-testid="composer-stop"
            className="touch-target hover:bg-neutral-800 rounded-full bg-neutral-900 px-4 py-3 text-sm text-foreground transition-colors"
            onClick={handleStop}
            aria-label="Antwort stoppen"
          >
            Stop
          </button>
        ) : (
          <button
            data-testid="composer-send"
            className={cn(
              "touch-target text-white rounded-full bg-accent-500 px-4 py-3 text-sm font-medium transition-colors hover:bg-accent-600",
              disabled && "opacity-50",
            )}
            onClick={handleSend}
            disabled={disabled}
            aria-label={`Nachricht senden (Enter)`}
          >
            Senden
          </button>
        )}
      </div>

      {/* Token Counter */}
      {text.trim() && (
        <div className="mt-2 text-xs text-neutral-600">
          ~{Math.ceil(text.trim().split(/\s+/).length * 1.3)} Tokens
        </div>
      )}
    </div>
  );
};
