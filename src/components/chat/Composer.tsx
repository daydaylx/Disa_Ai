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
      className="composer-container safe-bottom border-white/12 rounded-[28px] border bg-[rgba(17,22,31,0.82)] px-3 py-2 shadow-[0_20px_48px_rgba(0,0,0,0.45)]"
    >
      {/* Error Message */}
      {error && (
        <div
          ref={errorRef}
          id="composer-error"
          className="mb-3 rounded-lg border border-red-400/50 bg-red-500/10 p-3"
          role="alert"
          aria-live="assertive"
        >
          <div className="flex items-start justify-between">
            <div className="flex">
              <div className="text-red-400">
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
            <div className="ml-auto pl-3">
              <div className="-mx-1.5 -my-1.5">
                <button
                  type="button"
                  className="inline-flex rounded-md bg-red-500/10 p-1.5 text-red-300 transition hover:bg-red-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                  onClick={onClearError}
                  aria-label="Fehlermeldung schließen"
                >
                  <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  className="ml-2 inline-flex items-center rounded-md border border-red-400/40 bg-red-500/10 px-2.5 py-1.5 text-xs font-medium text-red-200 transition hover:bg-red-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                  onClick={handleSend}
                  disabled={disabled}
                >
                  Erneut senden
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="relative flex items-end gap-2">
        <textarea
          ref={textareaRef}
          data-testid="composer-input"
          className={cn(
            "border-white/12 w-full resize-none rounded-full border bg-[rgba(20,26,36,0.78)] px-5 py-3 pr-16 text-[15px] leading-5 text-text shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]",
            "placeholder:text-text-muted/70 transition-shadow duration-200",
            "focus:border-accent-2/60 focus:ring-accent-2/35 focus:ring-2 focus:ring-offset-2 focus:ring-offset-[rgba(10,14,22,0.6)] focus-visible:outline-none",
            error &&
              "border-red-400/60 focus:border-red-400 focus:ring-red-400/45 focus:ring-offset-red-900/40",
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

        {/* Voice Button - Temporarily disabled
        <div className="absolute bottom-2 right-16">
          <VoiceButton
            onTranscript={handleVoiceTranscript}
            onError={handleVoiceError}
            disabled={loading}
            className="h-8 w-8"
          />
        </div>

        <div className="absolute bottom-2 right-2">
          {loading ? (
            <button
              data-testid="composer-stop"
              className="tap touch-target flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-white/15 bg-[rgba(17,22,31,0.6)] px-4 py-2 text-sm text-text transition hover:border-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-2"
              onClick={handleStop}
              aria-label="Antwort stoppen"
            >
              Stop
            </button>
          ) : (
            <button
              data-testid="composer-send"
              className={cn(
                "tap touch-target flex h-11 w-11 items-center justify-center rounded-full text-sm font-medium text-white shadow-[0_14px_32px_rgba(168,85,247,0.35)] transition-transform duration-200",
                "hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[rgba(10,14,22,0.7)]",
                disabled && "pointer-events-none opacity-60",
              )}
              onClick={handleSend}
              disabled={disabled}
              aria-label={`Nachricht senden (Enter oder ${platformShortcut}+Enter)`}
              title={`Senden (Enter oder ${platformShortcut}+Enter)`}
              data-no-zoom
              style={{ background: "var(--brand-gradient)" }}
            >
              ✈️
            </button>
          )}
        </div>
      </div>

      {/* Token Counter */}
      {text.trim() && (
        <div className="text-text-muted/70 mt-2 px-2 text-xs">
          ~{Math.ceil(text.trim().split(/\s+/).length * 1.3)} Tokens
        </div>
      )}
    </div>
  );
};
