/**
 * Enhanced Audio Feedback System for Premium UI Interactions
 */

export interface AudioOptions {
  volume?: number;
  pitch?: number;
  duration?: number;
  type?: "beep" | "click" | "whoosh" | "pop" | "chime" | "notification";
  reverb?: boolean;
}

export type SoundPattern =
  | "hover"
  | "click"
  | "success"
  | "error"
  | "warning"
  | "nav-transition"
  | "card-flip"
  | "glow-pulse"
  | "matrix-rain"
  | "particle-explosion";

class AudioFeedbackSystem {
  private audioContext: AudioContext | null = null;
  private isEnabled = true;
  private volume = 0.3;

  constructor() {
    // Initialize audio context on first user interaction
    this.initializeOnUserGesture();
  }

  private initializeOnUserGesture() {
    const initAudio = () => {
      if (!this.audioContext) {
        try {
          this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        } catch {
          console.warn("Audio context not supported");
        }
      }
      document.removeEventListener("click", initAudio);
      document.removeEventListener("touchstart", initAudio);
    };

    document.addEventListener("click", initAudio, { once: true });
    document.addEventListener("touchstart", initAudio, { once: true });
  }

  private createOscillator(
    frequency: number,
    duration: number,
    type: OscillatorType = "sine",
  ): void {
    if (!this.audioContext || !this.isEnabled) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    oscillator.type = type;

    // Envelope for smooth sound
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(this.volume, this.audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  private createComplexSound(
    frequencies: number[],
    duration: number,
    type: OscillatorType = "sine",
  ): void {
    frequencies.forEach((freq, index) => {
      setTimeout(
        () => {
          this.createOscillator(freq, duration / frequencies.length, type);
        },
        (duration / frequencies.length) * index * 1000,
      );
    });
  }

  // Predefined sound patterns
  hover(): void {
    this.createOscillator(800, 0.1, "sine");
  }

  click(): void {
    this.createComplexSound([1000, 800], 0.15, "square");
  }

  success(): void {
    this.createComplexSound([523, 659, 784], 0.5, "sine"); // C-E-G chord
  }

  error(): void {
    this.createComplexSound([400, 300, 200], 0.6, "sawtooth");
  }

  warning(): void {
    this.createComplexSound([600, 500], 0.4, "triangle");
  }

  navTransition(): void {
    this.createComplexSound([500, 700, 900], 0.3, "sine");
  }

  cardFlip(): void {
    this.createComplexSound([400, 600, 400], 0.4, "triangle");
  }

  glowPulse(): void {
    this.createOscillator(300, 0.2, "sine");
  }

  matrixRain(): void {
    // Subtle digital rain sound
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        this.createOscillator(200 + Math.random() * 400, 0.05, "square");
      }, i * 100);
    }
  }

  particleExplosion(): void {
    // Burst of high-frequency sounds
    for (let i = 0; i < 8; i++) {
      setTimeout(() => {
        this.createOscillator(800 + Math.random() * 800, 0.1, "sine");
      }, i * 20);
    }
  }

  // Play specific pattern
  play(pattern: SoundPattern): void {
    switch (pattern) {
      case "hover":
        this.hover();
        break;
      case "click":
        this.click();
        break;
      case "success":
        this.success();
        break;
      case "error":
        this.error();
        break;
      case "warning":
        this.warning();
        break;
      case "nav-transition":
        this.navTransition();
        break;
      case "card-flip":
        this.cardFlip();
        break;
      case "glow-pulse":
        this.glowPulse();
        break;
      case "matrix-rain":
        this.matrixRain();
        break;
      case "particle-explosion":
        this.particleExplosion();
        break;
    }
  }

  // Control methods
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  isAudioEnabled(): boolean {
    return this.isEnabled && !!this.audioContext;
  }
}

// Create singleton instance
export const audioFeedback = new AudioFeedbackSystem();

// Enhanced haptic patterns for premium effects
export interface EnhancedHapticOptions {
  pattern?: "subtle" | "medium" | "strong" | "burst" | "pulse" | "wave";
  duration?: number;
  intensity?: number;
}

class EnhancedHapticSystem {
  private isEnabled = true;

  // Custom vibration patterns (duration, pause, duration, pause, ...)
  private patterns = {
    subtle: [10],
    medium: [20],
    strong: [50],
    burst: [10, 50, 10, 50, 10],
    pulse: [30, 100, 30, 100, 30],
    wave: [10, 20, 30, 40, 50, 40, 30, 20, 10],
  };

  vibrate(options: EnhancedHapticOptions = {}): void {
    if (!this.isEnabled || !navigator.vibrate) return;

    const { pattern = "medium", intensity = 1 } = options;
    const vibrationPattern = this.patterns[pattern];

    // Scale pattern by intensity
    const scaledPattern = vibrationPattern.map((duration) => Math.round(duration * intensity));

    navigator.vibrate(scaledPattern);
  }

  // Convenience methods
  hover(): void {
    this.vibrate({ pattern: "subtle" });
  }

  click(): void {
    this.vibrate({ pattern: "medium" });
  }

  success(): void {
    this.vibrate({ pattern: "pulse" });
  }

  error(): void {
    this.vibrate({ pattern: "burst", intensity: 1.5 });
  }

  cardFlip(): void {
    this.vibrate({ pattern: "wave" });
  }

  explosion(): void {
    this.vibrate({ pattern: "burst", intensity: 2 });
  }

  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  isHapticEnabled(): boolean {
    return this.isEnabled && "vibrate" in navigator;
  }
}

export const enhancedHaptics = new EnhancedHapticSystem();

// Combined feedback system
export class PremiumFeedbackSystem {
  constructor(
    private audio = audioFeedback,
    private haptics = enhancedHaptics,
  ) {}

  // Combined feedback for different interaction types
  hover(): void {
    this.audio.hover();
    this.haptics.hover();
  }

  click(): void {
    this.audio.click();
    this.haptics.click();
  }

  success(): void {
    this.audio.success();
    this.haptics.success();
  }

  error(): void {
    this.audio.error();
    this.haptics.error();
  }

  cardFlip(): void {
    this.audio.cardFlip();
    this.haptics.cardFlip();
  }

  particleExplosion(): void {
    this.audio.particleExplosion();
    this.haptics.explosion();
  }

  navTransition(): void {
    this.audio.navTransition();
    this.haptics.click();
  }

  // Settings
  setAudioEnabled(enabled: boolean): void {
    this.audio.setEnabled(enabled);
  }

  setHapticEnabled(enabled: boolean): void {
    this.haptics.setEnabled(enabled);
  }

  setVolume(volume: number): void {
    this.audio.setVolume(volume);
  }
}

export const premiumFeedback = new PremiumFeedbackSystem();
