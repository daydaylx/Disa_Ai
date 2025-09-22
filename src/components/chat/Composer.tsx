import * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import { executeSlashCommand, parseSlashCommand } from "../../lib/chat/slashCommands";
import { hapticFeedback } from "../../lib/touch/haptics";
import { cn } from "../../lib/utils/cn";
import { useToasts } from "../ui/Toast";

const MAX_TEXTAREA_LINES = 8;
const LINE_HEIGHT = 20;
const MIN_HEIGHT = 56;

export const Composer: React.FC<{
  loading?: boolean;
  streaming?: boolean;
  onSend: (text: string) => void;
  onStop: () => void;
  error?: string | null;
  onClearError?: () => void;
}> = ({ loading, streaming, onSend, onStop, error, onClearError }) => {
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
  const [_showCommandSuggestions, setShowCommandSuggestions] = useState(false);
  const toasts = useToasts();
  const isLoading = loading || streaming;
  const disabled = isLoading || text.trim().length === 0;

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

  const handleSend = useCallback(async () => {
    if (disabled) return;

    const trimmedText = text.trim();

    // Check if it's a slash command
    const parsed = parseSlashCommand(trimmedText);
    if (parsed.isCommand) {
      try {
        hapticFeedback.select();
        const result = await executeSlashCommand(trimmedText);

        if (result.success) {
          toasts.push({
            kind: "success",
            title: "Befehl ausgeführt",
            message: result.message,
          });
          if (result.shouldClearInput) {
            setText("");
          }
        } else {
          toasts.push({
            kind: "error",
            title: "Befehl fehlgeschlagen",
            message: result.message,
          });
        }
        onClearError?.();
        return;
      } catch (error) {
        toasts.push({
          kind: "error",
          title: "Befehl-Fehler",
          message: "Unerwarteter Fehler beim Ausführen des Befehls",
        });
        console.error("Slash command error:", error);
        return;
      }
    }

    // Regular message sending
    hapticFeedback.success();
    onSend(trimmedText);
    setText("");
    onClearError?.();
  }, [disabled, text, onSend, onClearError, toasts]);

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
          void handleSend();
        } else {
          // Plain Enter: Send if not disabled
          e.preventDefault();
          void handleSend();
        }
      }
    },
    [handleSend, isComposing],
  );

  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newText = e.target.value;
      setText(newText);

      // Show command suggestions if text starts with /
      const trimmed = newText.trim();
      setShowCommandSuggestions(trimmed.startsWith("/") && trimmed.length > 1);

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

  return (
    <div ref={composerRef} className="glass-composer safe-bottom">
      {error && (
        <div
          ref={errorRef}
          id="composer-error"
          className="bg-bg-danger-subtle mb-3 rounded-md border border-danger p-3 text-sm text-danger"
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
                onClick={() => void handleSend()}
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
            "glass-composer__input w-full resize-none pr-12",
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
          {isLoading ? (
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
              className={cn("glass-composer__send", disabled && "pointer-events-none opacity-60")}
              onClick={() => void handleSend()}
              disabled={disabled}
              aria-label={`Nachricht senden (Enter oder ${platformShortcut}+Enter)`}
              title={`Senden (Enter oder ${platformShortcut}+Enter)`}
              data-no-zoom
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="mt-2 flex justify-between text-xs text-muted/60">
        <span>~{Math.ceil(text.trim().split(/\s+/).length * 1.3)} Token</span>
        <span className="text-xs text-muted/80">
          💡 Verfügbare Befehle: <span className="text-white">/stil, /rolle, /nsfw, /hilfe</span>
        </span>
      </div>
    </div>
  );
};
