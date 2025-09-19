/**
 * Voice-to-Text Integration für mobile Geräte
 */

import { hapticFeedback } from "../touch/haptics";

export interface VoiceToTextOptions {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
  maxAlternatives?: number;
  timeout?: number;
  enableHapticFeedback?: boolean;
  enableVisualFeedback?: boolean;
}

export interface VoiceRecognitionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
  alternatives?: string[];
}

export interface VoiceRecognitionError {
  code: string;
  message: string;
  type: "network" | "permission" | "not-supported" | "no-speech" | "aborted" | "unknown";
}

const DEFAULT_OPTIONS: Required<VoiceToTextOptions> = {
  language: "de-DE",
  continuous: false,
  interimResults: true,
  maxAlternatives: 3,
  timeout: 30000,
  enableHapticFeedback: true,
  enableVisualFeedback: true,
};

/**
 * Voice-to-Text Manager
 */
export class VoiceToTextManager {
  private options: Required<VoiceToTextOptions>;
  private recognition: any | null = null;
  private isListening = false;
  private isSupported = false;
  private visualIndicator: HTMLElement | null = null;
  private timeoutId: number | null = null;

  private onResultCallback?: (result: VoiceRecognitionResult) => void;
  private onErrorCallback?: (error: VoiceRecognitionError) => void;
  private onStatusChangeCallback?: (status: "idle" | "listening" | "processing" | "error") => void;

  constructor(options: VoiceToTextOptions = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.checkSupport();
    this.initializeRecognition();
  }

  /**
   * Browser-Support prüfen
   */
  private checkSupport(): void {
    this.isSupported = "webkitSpeechRecognition" in window || "SpeechRecognition" in window;
  }

  /**
   * Speech Recognition initialisieren
   */
  private initializeRecognition(): void {
    if (!this.isSupported) return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();

    this.recognition.lang = this.options.language;
    this.recognition.continuous = this.options.continuous;
    this.recognition.interimResults = this.options.interimResults;
    this.recognition.maxAlternatives = this.options.maxAlternatives;

    this.setupEventHandlers();
  }

  /**
   * Event-Handler einrichten
   */
  private setupEventHandlers(): void {
    if (!this.recognition) return;

    this.recognition.onstart = () => {
      this.isListening = true;
      this.onStatusChangeCallback?.("listening");

      if (this.options.enableHapticFeedback) {
        hapticFeedback.success();
      }

      if (this.options.enableVisualFeedback) {
        this.showVisualIndicator();
      }

      // Timeout setzen
      this.timeoutId = window.setTimeout(() => {
        this.stop();
      }, this.options.timeout);
    };

    this.recognition.onresult = (event: any) => {
      this.onStatusChangeCallback?.("processing");

      const results = Array.from(event.results);
      const lastResult = results[results.length - 1] as any;

      if (lastResult) {
        const transcript = lastResult[0]?.transcript || "";
        const confidence = lastResult[0]?.confidence || 0;
        const isFinal = lastResult.isFinal;

        // Alternativen sammeln
        const alternatives = Array.from(lastResult)
          .slice(1, this.options.maxAlternatives)
          .map((result: any) => result.transcript);

        const result: VoiceRecognitionResult = {
          transcript: transcript.trim(),
          confidence,
          isFinal,
          alternatives,
        };

        this.onResultCallback?.(result);

        if (isFinal) {
          if (this.options.enableHapticFeedback) {
            hapticFeedback.success();
          }

          if (!this.options.continuous) {
            this.stop();
          }
        }
      }
    };

    this.recognition.onerror = (event: any) => {
      this.onStatusChangeCallback?.("error");

      const error: VoiceRecognitionError = {
        code: event.error,
        message: this.getErrorMessage(event.error),
        type: this.getErrorType(event.error),
      };

      this.onErrorCallback?.(error);

      if (this.options.enableHapticFeedback) {
        hapticFeedback.error();
      }

      this.stop();
    };

    this.recognition.onend = () => {
      this.isListening = false;
      this.onStatusChangeCallback?.("idle");
      this.hideVisualIndicator();

      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
        this.timeoutId = null;
      }
    };
  }

  /**
   * Fehlermeldungen übersetzen
   */
  private getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case "network":
        return "Netzwerkfehler bei der Spracherkennung";
      case "not-allowed":
        return "Mikrofon-Berechtigung verweigert";
      case "no-speech":
        return "Keine Sprache erkannt";
      case "aborted":
        return "Spracherkennung abgebrochen";
      case "audio-capture":
        return "Mikrofon nicht verfügbar";
      case "service-not-allowed":
        return "Spracherkennungsdienst nicht verfügbar";
      default:
        return "Unbekannter Fehler bei der Spracherkennung";
    }
  }

  /**
   * Fehlertyp bestimmen
   */
  private getErrorType(errorCode: string): VoiceRecognitionError["type"] {
    switch (errorCode) {
      case "network":
        return "network";
      case "not-allowed":
      case "service-not-allowed":
        return "permission";
      case "no-speech":
        return "no-speech";
      case "aborted":
        return "aborted";
      default:
        return "unknown";
    }
  }

  /**
   * Visueller Indikator anzeigen
   */
  private showVisualIndicator(): void {
    if (this.visualIndicator) return;

    this.visualIndicator = document.createElement("div");
    this.visualIndicator.className = "voice-recording-indicator";
    this.visualIndicator.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: #ef4444;
      color: white;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
      backdrop-filter: blur(10px);
      z-index: 1000;
      display: flex;
      align-items: center;
      gap: 8px;
      animation: pulse-recording 1.5s infinite ease-in-out;
    `;

    // Mikrofon-Icon hinzufügen
    const icon = document.createElement("div");
    icon.style.cssText = `
      width: 12px;
      height: 12px;
      background: currentColor;
      border-radius: 50%;
      animation: pulse 1s infinite ease-in-out;
    `;

    this.visualIndicator.appendChild(icon);
    this.visualIndicator.appendChild(document.createTextNode("Aufnahme läuft..."));

    // CSS-Animation hinzufügen
    const style = document.createElement("style");
    style.textContent = `
      @keyframes pulse-recording {
        0%, 100% { opacity: 1; transform: translateX(-50%) scale(1); }
        50% { opacity: 0.8; transform: translateX(-50%) scale(1.05); }
      }
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
    `;
    document.head.appendChild(style);

    document.body.appendChild(this.visualIndicator);
  }

  /**
   * Visueller Indikator ausblenden
   */
  private hideVisualIndicator(): void {
    if (this.visualIndicator) {
      this.visualIndicator.style.animation = "fadeOut 0.3s ease-out forwards";
      setTimeout(() => {
        if (this.visualIndicator) {
          document.body.removeChild(this.visualIndicator);
          this.visualIndicator = null;
        }
      }, 300);
    }
  }

  /**
   * Event-Handler registrieren
   */
  onResult(callback: (result: VoiceRecognitionResult) => void): this {
    this.onResultCallback = callback;
    return this;
  }

  onError(callback: (error: VoiceRecognitionError) => void): this {
    this.onErrorCallback = callback;
    return this;
  }

  onStatusChange(callback: (status: "idle" | "listening" | "processing" | "error") => void): this {
    this.onStatusChangeCallback = callback;
    return this;
  }

  /**
   * Spracherkennung starten
   */
  start(): boolean {
    if (!this.isSupported || !this.recognition || this.isListening) {
      return false;
    }

    try {
      this.recognition.start();
      return true;
    } catch {
      this.onErrorCallback?.({
        code: "start-failed",
        message: "Spracherkennung konnte nicht gestartet werden",
        type: "unknown",
      });
      return false;
    }
  }

  /**
   * Spracherkennung stoppen
   */
  stop(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }

  /**
   * Spracherkennung abbrechen
   */
  abort(): void {
    if (this.recognition && this.isListening) {
      this.recognition.abort();
    }
  }

  /**
   * Status-Abfragen
   */
  get supported(): boolean {
    return this.isSupported;
  }

  get listening(): boolean {
    return this.isListening;
  }

  /**
   * Optionen aktualisieren
   */
  updateOptions(options: Partial<VoiceToTextOptions>): void {
    this.options = { ...this.options, ...options };

    if (this.recognition) {
      this.recognition.lang = this.options.language;
      this.recognition.continuous = this.options.continuous;
      this.recognition.interimResults = this.options.interimResults;
      this.recognition.maxAlternatives = this.options.maxAlternatives;
    }
  }

  /**
   * Cleanup
   */
  destroy(): void {
    this.stop();
    this.hideVisualIndicator();

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }

    this.onResultCallback = undefined;
    this.onErrorCallback = undefined;
    this.onStatusChangeCallback = undefined;
  }
}

/**
 * Simple Voice-to-Text Manager ohne React-Dependencies
 */
export function createVoiceToTextManager(options: VoiceToTextOptions = {}) {
  const manager = new VoiceToTextManager(options);
  return {
    manager,
    isListening: manager.listening,
    status: "idle" as const,
    isSupported: manager.supported,
    start: () => manager.start(),
    stop: () => manager.stop(),
    abort: () => manager.abort(),
  };
}

/**
 * React Hook für Voice-to-Text (placeholder - needs React import)
 */
export function useVoiceToText(options: VoiceToTextOptions = {}) {
  // Diese Funktion sollte nur verwendet werden, wenn React verfügbar ist
  // Für jetzt geben wir einen statischen Manager zurück
  return createVoiceToTextManager(options);
}

// Browser-Typen erweitern
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}
