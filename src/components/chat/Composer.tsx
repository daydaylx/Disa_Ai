import * as React from "react";
import { useEffect, useRef, useState } from "react";

import { hapticFeedback } from "../../lib/touch/haptics";
import { cn } from "../../lib/utils/cn";
import { VoiceButton } from "./VoiceButton";

export const Composer: React.FC<{
  loading?: boolean;
  onSend: (text: string) => void;
  onStop: () => void;
}> = ({ loading, onSend, onStop }) => {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const composerRef = useRef<HTMLDivElement>(null);
  const disabled = loading || text.trim().length === 0;

  // Handle keyboard visibility and scrolling
  useEffect(() => {
    const handleResize = () => {
      if (textareaRef.current && document.activeElement === textareaRef.current) {
        // Delay scroll to allow keyboard animation
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

  const handleSend = () => {
    if (!disabled) {
      hapticFeedback.success();
      onSend(text.trim());
      setText("");
    }
  };

  const handleStop = () => {
    hapticFeedback.warning();
    onStop();
  };

  const handleVoiceTranscript = (transcript: string) => {
    setText(transcript);
    // Auto-focus textarea nach Voice-Input
    textareaRef.current?.focus();
  };

  const handleVoiceError = (error: string) => {
    // Zeige Toast-Nachricht oder andere Fehlerbehandlung
    console.warn("Voice recognition error:", error);
  };

  return (
    <div ref={composerRef} className="composer-container safe-pad safe-bottom py-3">
      <div className="relative flex items-end gap-2">
        <textarea
          ref={textareaRef}
          data-testid="composer-input"
          className={cn(
            "max-h-[40dvh] min-h-[56px] w-full p-4 pr-14 text-[15px] leading-5",
            "touch-target resize-none rounded-[14px] outline-none",
            "border border-white/30 bg-white/70 backdrop-blur-md",
            "placeholder:text-slate-500",
            "keyboard-aware",
          )}
          placeholder="Nachricht eingeben… (/role, /style, /nsfw, /model verfügbar)"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => {
            // Light haptic feedback when focusing input
            hapticFeedback.select();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          inputMode="text"
          autoCapitalize="sentences"
          autoCorrect="on"
        />

        {/* Voice Button */}
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
              className="tap nav-pill touch-target px-3 py-2 text-sm"
              onClick={handleStop}
            >
              Stop
            </button>
          ) : (
            <button
              data-testid="composer-send"
              className={cn(
                "tap btn-primary touch-target rounded-[14px] px-3 py-3",
                disabled && "pointer-events-none opacity-60",
              )}
              onClick={handleSend}
              aria-label="Senden"
              data-no-zoom
            >
              ✈️
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
