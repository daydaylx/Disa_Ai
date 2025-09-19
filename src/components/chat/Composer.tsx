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
  const [text, setText] = useState("");
  const [textareaHeight, setTextareaHeight] = useState(MIN_HEIGHT);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const composerRef = useRef<HTMLDivElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);
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
    [handleSend],
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

  // Voice handlers - temporarily disabled
  // const _handleVoiceTranscript = useCallback((transcript: string) => {
  //   setText(transcript);
  //   textareaRef.current?.focus();
  // }, []);

  // const _handleVoiceError = useCallback((error: string) => {
  //   console.warn("Voice recognition error:", error);
  // }, []);

  return (
    <div ref={composerRef} className="composer-container safe-pad safe-bottom py-3">
      {/* Error Message */}
      {error && (
        <div
          ref={errorRef}
          className="mb-3 rounded-lg border border-red-200 bg-red-50 p-3"
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
                  className="inline-flex rounded-md bg-red-50 p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50"
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
                  className="ml-2 inline-flex items-center rounded-md border border-transparent bg-red-100 px-2.5 py-1.5 text-xs font-medium text-red-800 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
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
            "w-full resize-none rounded-[14px] p-4 pr-20 text-[15px] leading-5 outline-none",
            "border border-white/30 bg-white/70 backdrop-blur-md",
            "keyboard-aware placeholder:text-slate-500",
            "focus:border-blue-500 focus:ring-2 focus:ring-blue-500",
            "transition-all duration-200",
            error && "border-red-300 focus:border-red-500 focus:ring-red-500",
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
        */}

        <div className="absolute bottom-2 right-2">
          {loading ? (
            <button
              data-testid="composer-stop"
              className="tap nav-pill touch-target min-h-[44px] min-w-[44px] px-3 py-2 text-sm"
              onClick={handleStop}
              aria-label="Antwort stoppen"
            >
              Stop
            </button>
          ) : (
            <button
              data-testid="composer-send"
              className={cn(
                "tap btn-primary touch-target min-h-[44px] min-w-[44px] rounded-[14px] px-3 py-3",
                "flex items-center justify-center",
                disabled && "pointer-events-none opacity-60",
              )}
              onClick={handleSend}
              disabled={disabled}
              aria-label={`Nachricht senden (Enter oder ${navigator.platform.includes("Mac") ? "Cmd" : "Strg"}+Enter)`}
              title={`Senden (Enter oder ${navigator.platform.includes("Mac") ? "Cmd" : "Strg"}+Enter)`}
              data-no-zoom
            >
              ✈️
            </button>
          )}
        </div>
      </div>

      {/* Optional Token Counter */}
      {text.trim() && (
        <div className="mt-2 px-2 text-xs text-slate-500">
          ~{Math.ceil(text.trim().split(/\s+/).length * 1.3)} Tokens
        </div>
      )}
    </div>
  );
};
