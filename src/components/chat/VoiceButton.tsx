/**
 * Voice-to-Text Button Komponente für mobile Chat-Eingabe
 */

import * as React from "react";
import { useCallback, useState } from "react";

import { useVoiceToText, VoiceRecognitionResult } from "../../lib/speech/voiceToText";
import { hapticFeedback } from "../../lib/touch/haptics";
import { cn } from "../../lib/utils/cn";

export interface VoiceButtonProps {
  onTranscript: (text: string) => void;
  onError?: (error: string) => void;
  disabled?: boolean;
  className?: string;
  language?: string;
}

export const VoiceButton: React.FC<VoiceButtonProps> = ({
  onTranscript,
  onError,
  disabled = false,
  className,
  language = "de-DE",
}) => {
  const [transcript, setTranscript] = useState("");
  const [hasPermission, setHasPermission] = useState(true);

  const { manager, isListening, isSupported, start, stop } = useVoiceToText({
    language,
    continuous: false,
    interimResults: true,
    enableHapticFeedback: true,
    enableVisualFeedback: true,
  });

  // Mikrofon-Berechtigung prüfen
  React.useEffect(() => {
    if (navigator.permissions) {
      void navigator.permissions.query({ name: "microphone" as PermissionName }).then((result) => {
        setHasPermission(result.state === "granted");
      });
    }
  }, []);

  // Voice Recognition Events
  React.useEffect(() => {
    manager
      .onResult((result: VoiceRecognitionResult) => {
        setTranscript(result.transcript);

        if (result.isFinal && result.transcript.trim()) {
          onTranscript(result.transcript.trim());
          setTranscript("");
        }
      })
      .onError((error) => {
        const errorMessage = getErrorMessage(error.type);
        onError?.(errorMessage);
        hapticFeedback.error();

        if (error.type === "permission") {
          setHasPermission(false);
        }
      });
  }, [manager, onTranscript, onError]);

  const getErrorMessage = (errorType: string): string => {
    switch (errorType) {
      case "permission":
        return "Mikrofon-Berechtigung erforderlich";
      case "network":
        return "Netzwerkfehler bei der Spracherkennung";
      case "no-speech":
        return "Keine Sprache erkannt";
      case "not-supported":
        return "Spracherkennung nicht unterstützt";
      default:
        return "Fehler bei der Spracherkennung";
    }
  };

  const handleClick = useCallback(() => {
    if (disabled || !isSupported) return;

    if (isListening) {
      stop();
      hapticFeedback.tap();
    } else {
      const success = start();
      if (success) {
        hapticFeedback.success();
      } else {
        hapticFeedback.error();
      }
    }
  }, [disabled, isSupported, isListening, start, stop]);

  const handleLongPress = useCallback(() => {
    if (disabled || !isSupported || isListening) return;

    // Long Press für kontinuierliche Aufnahme
    manager.updateOptions({ continuous: true });
    const success = start();
    if (success) {
      hapticFeedback.impact("medium");
    }
  }, [disabled, isSupported, isListening, manager, start]);

  // Render Zustände
  if (!isSupported) {
    return (
      <div className={cn("flex items-center gap-2 text-xs text-gray-500", className)}>
        <span>🎤</span>
        <span>Spracherkennung nicht verfügbar</span>
      </div>
    );
  }

  if (!hasPermission) {
    return (
      <button
        type="button"
        onClick={() => {
          // Berechtigung anfordern
          navigator.mediaDevices
            .getUserMedia({ audio: true })
            .then(() => setHasPermission(true))
            .catch(() => onError?.("Mikrofon-Berechtigung erforderlich"));
        }}
        className={cn(
          "inline-flex h-10 w-10 items-center justify-center rounded-full",
          "bg-orange-500 text-white transition-colors hover:bg-orange-600",
          "touch-target",
          className,
        )}
        data-no-zoom
        aria-label="Mikrofon-Berechtigung erteilen"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <path d="M12 19v4M8 23h8" />
          <path d="M16 8L8 16M8 8l8 8" />
        </svg>
      </button>
    );
  }

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        onClick={handleClick}
        onPointerDown={handleLongPress}
        disabled={disabled}
        className={cn(
          "inline-flex h-10 w-10 items-center justify-center rounded-full transition-all",
          "touch-target",
          isListening
            ? "scale-110 animate-pulse bg-red-500 text-white"
            : "bg-blue-500 text-white hover:bg-blue-600",
          disabled && "cursor-not-allowed opacity-50",
        )}
        data-no-zoom
        aria-label={isListening ? "Aufnahme stoppen" : "Sprachaufnahme starten"}
        aria-pressed={isListening}
      >
        {isListening ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <circle cx="12" cy="12" r="3" opacity="0.4">
              <animate
                attributeName="opacity"
                values="0.4;1;0.4"
                dur="1s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <path d="M12 19v4M8 23h8" />
          </svg>
        )}
      </button>

      {/* Transcript Preview */}
      {transcript && (
        <div className="absolute bottom-12 left-1/2 z-50 -translate-x-1/2 transform">
          <div className="max-w-64 rounded-lg bg-black/80 px-3 py-2 text-sm text-white backdrop-blur">
            <div className="mb-1 text-xs text-gray-300">Spracherkennung:</div>
            <div className="text-white">{transcript}</div>
          </div>
        </div>
      )}

      {/* Status Indicator */}
      {isListening && (
        <div className="absolute -right-1 -top-1 h-3 w-3 animate-pulse rounded-full bg-red-500" />
      )}
    </div>
  );
};

/**
 * Voice Input Hook für erweiterte Funktionalität
 */
export function useVoiceInput(onTranscript: (text: string) => void) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [lastTranscript, setLastTranscript] = useState("");

  const { manager, isListening, isSupported } = useVoiceToText({
    language: "de-DE",
    continuous: true,
    interimResults: true,
  });

  React.useEffect(() => {
    if (!isEnabled) return;

    manager.onResult((result) => {
      if (result.isFinal && result.transcript.trim()) {
        const newText = result.transcript.trim();
        setLastTranscript(newText);
        onTranscript(newText);
      }
    });
  }, [isEnabled, manager, onTranscript]);

  const toggleVoiceInput = useCallback(() => {
    if (!isSupported) return false;

    if (isListening) {
      manager.stop();
      setIsEnabled(false);
    } else {
      const success = manager.start();
      setIsEnabled(success);
      return success;
    }
    return true;
  }, [isSupported, isListening, manager]);

  return {
    isEnabled,
    isListening,
    isSupported,
    lastTranscript,
    toggle: toggleVoiceInput,
    start: () => {
      const success = manager.start();
      setIsEnabled(success);
      return success;
    },
    stop: () => {
      manager.stop();
      setIsEnabled(false);
    },
  };
}
