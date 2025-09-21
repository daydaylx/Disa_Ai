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
  const [platformShortcut, setPlatformShortcut] = useState("Strg");
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
    const handleViewportChange = () => {
      // Only scroll if textarea is focused and keyboard opens
      if (textareaRef.current && document.activeElement === textareaRef.current) {
        // Use requestAnimationFrame for better performance
        requestAnimationFrame(() => {
          // Ensure composer stays visible above keyboard
          textareaRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "nearest", // More stable than "center"
          });
        });
      }
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", handleViewportChange);
      return () => window.visualViewport?.removeEventListener("resize", handleViewportChange);
    } else {
      // Fallback for older browsers
      window.addEventListener("resize", handleViewportChange);
      return () => window.removeEventListener("resize", handleViewportChange);
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
      className="safe-bottom rounded-[18px] border border-border-strong bg-surface-200 p-3 shadow-elev2"
    >
      {error && (
        <div
          ref={errorRef}
          id="composer-error"
          className="mb-3 rounded-md border border-danger bg-bg-danger-subtle p-3 text-sm text-danger"
          role="alert"
          aria-live="assertive"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="min-w-0 flex-1">{error}</span>
            <div className="flex shrink-0 gap-2">
              <button type="button" className="btn btn-ghost btn-sm" onClick={onClearError}>
                Schließen
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={handleSend}
                disabled={disabled}
              >
                Erneut senden
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="relative flex items-end gap-2">
        <textarea
          ref={textareaRef}
          data-testid="composer-input"
          className={cn(
            "textarea w-full resize-none rounded-lg bg-transparent pr-12 text-base leading-6",
            "placeholder:text-text-muted focus-visible:outline-none",
            error && "border-danger focus:border-danger",
          )}
          style={{ height: `${textareaHeight}px` }}
          placeholder="Nachricht eingeben… (/role, /style, /nsfw, /model verfügbar)"
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

        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          {loading ? (
            <button
              data-testid="composer-stop"
              className="btn btn-ghost btn-sm"
              onClick={handleStop}
              aria-label="Antwort stoppen"
            >
              Stop
            </button>
          ) : (
            <button
              data-testid="composer-send"
              className={cn("btn btn-primary btn-sm", disabled && "pointer-events-none opacity-60")}
              onClick={handleSend}
              disabled={disabled}
              aria-label={`Nachricht senden (Enter oder ${platformShortcut}+Enter)`}
              title={`Senden (Enter oder ${platformShortcut}+Enter)`}
              data-no-zoom
            >
              Senden
            </button>
          )}
        </div>
      </div>

      {text.trim() && (
        <div className="mt-2 px-1 text-xs text-text-muted">
          ~{Math.ceil(text.trim().split(/\s+/).length * 1.3)} Tokens
        </div>
      )}
    </div>
  );
};
