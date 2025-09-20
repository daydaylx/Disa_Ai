/**
 * Progressive Enhancement für Mobile Geräte
 * Adaptive Features basierend auf Device-Capabilities
 */

import { useEffect, useState } from "react";

interface DeviceCapabilities {
  // Display
  isRetina: boolean;
  hasHighRefreshRate: boolean;
  screenSize: "small" | "medium" | "large";
  colorGamut: "srgb" | "p3" | "rec2020";

  // Performance
  hardwareConcurrency: number;
  deviceMemory?: number;
  cpuClass?: string;

  // Input
  hasTouchScreen: boolean;
  hasStylus: boolean;
  hasKeyboard: boolean;
  hasMouse: boolean;

  // Sensors
  hasAccelerometer: boolean;
  hasGyroscope: boolean;
  hasAmbientLight: boolean;
  hasDeviceMotion: boolean;

  // Network
  connectionType: string;
  effectiveType: string;
  downlink?: number;

  // Features
  hasWebGL: boolean;
  hasWebGL2: boolean;
  hasOffscreenCanvas: boolean;
  hasWebWorkers: boolean;
  hasServiceWorker: boolean;
  hasWebAssembly: boolean;

  // Audio/Video
  hasWebAudio: boolean;
  hasMediaRecorder: boolean;
  hasWebRTC: boolean;

  // Storage
  hasIndexedDB: boolean;
  hasWebSQL: boolean;
  persistentStorage: boolean;

  // Security
  isSecureContext: boolean;
  hasClipboard: boolean;
  hasNotifications: boolean;
}

interface EnhancementLevel {
  level: "minimal" | "standard" | "enhanced" | "premium";
  features: {
    animations: boolean;
    particleEffects: boolean;
    complexShaders: boolean;
    backgroundProcessing: boolean;
    advancedGestures: boolean;
    voiceRecognition: boolean;
    hapticFeedback: boolean;
    enhancedUI: boolean;
  };
}

class ProgressiveEnhancementManager {
  private capabilities: DeviceCapabilities | null = null;
  private enhancementLevel: EnhancementLevel | null = null;
  private observers: Array<(capabilities: DeviceCapabilities, level: EnhancementLevel) => void> =
    [];

  constructor() {
    void this.detectCapabilities().then((capabilities) => {
      this.capabilities = capabilities;
      this.enhancementLevel = this.determineEnhancementLevel(capabilities);
      this.applyEnhancements();
      this.notifyObservers();
    });
  }

  private async detectCapabilities(): Promise<DeviceCapabilities> {
    const capabilities: DeviceCapabilities = {
      // Display Detection
      isRetina: window.devicePixelRatio > 1,
      hasHighRefreshRate: this.detectHighRefreshRate(),
      screenSize: this.getScreenSize(),
      colorGamut: this.detectColorGamut(),

      // Performance Detection
      hardwareConcurrency: navigator.hardwareConcurrency || 1,
      deviceMemory: (navigator as any).deviceMemory,
      cpuClass: (navigator as any).cpuClass,

      // Input Detection
      hasTouchScreen: "ontouchstart" in window || navigator.maxTouchPoints > 0,
      hasStylus: this.detectStylus(),
      hasKeyboard: this.detectKeyboard(),
      hasMouse: this.detectMouse(),

      // Sensor Detection
      hasAccelerometer: "DeviceMotionEvent" in window,
      hasGyroscope: "DeviceOrientationEvent" in window,
      hasAmbientLight: "AmbientLightSensor" in window,
      hasDeviceMotion: this.detectDeviceMotion(),

      // Network Detection
      connectionType: this.getConnectionType(),
      effectiveType: this.getEffectiveType(),
      downlink: (navigator as any).connection?.downlink,

      // Feature Detection
      hasWebGL: this.detectWebGL(),
      hasWebGL2: this.detectWebGL2(),
      hasOffscreenCanvas: "OffscreenCanvas" in window,
      hasWebWorkers: "Worker" in window,
      hasServiceWorker: "serviceWorker" in navigator,
      hasWebAssembly: "WebAssembly" in window,

      // Audio/Video Detection
      hasWebAudio: "AudioContext" in window || "webkitAudioContext" in window,
      hasMediaRecorder: "MediaRecorder" in window,
      hasWebRTC: "RTCPeerConnection" in window,

      // Storage Detection
      hasIndexedDB: "indexedDB" in window,
      hasWebSQL: "openDatabase" in window,
      persistentStorage: await this.checkPersistentStorage(),

      // Security Detection
      isSecureContext: window.isSecureContext,
      hasClipboard: "clipboard" in navigator,
      hasNotifications: "Notification" in window,
    };

    return capabilities;
  }

  private detectHighRefreshRate(): boolean {
    return new Promise<boolean>((resolve) => {
      let lastTime = performance.now();
      let frameCount = 0;
      let sum = 0;

      function measureFrame() {
        const currentTime = performance.now();
        const delta = currentTime - lastTime;
        lastTime = currentTime;

        if (frameCount > 10) {
          // Skip first few frames
          sum += 1000 / delta; // FPS
        }

        frameCount++;

        if (frameCount < 60) {
          requestAnimationFrame(measureFrame);
        } else {
          const avgFPS = sum / (frameCount - 10);
          resolve(avgFPS > 90); // Consider > 90fps as high refresh rate
        }
      }

      requestAnimationFrame(measureFrame);
    }) as any; // Simplified for sync return
  }

  private getScreenSize(): "small" | "medium" | "large" {
    const width = window.screen.width * window.devicePixelRatio;
    if (width < 768) return "small";
    if (width < 1024) return "medium";
    return "large";
  }

  private detectColorGamut(): "srgb" | "p3" | "rec2020" {
    if (window.matchMedia && window.matchMedia("(color-gamut: rec2020)").matches) {
      return "rec2020";
    }
    if (window.matchMedia && window.matchMedia("(color-gamut: p3)").matches) {
      return "p3";
    }
    return "srgb";
  }

  private detectStylus(): boolean {
    // Check for pressure-sensitive input
    return (
      window.matchMedia &&
      window.matchMedia("(pointer: fine)").matches &&
      window.matchMedia("(hover: hover)").matches
    );
  }

  private detectKeyboard(): boolean {
    return window.matchMedia && !window.matchMedia("(pointer: coarse)").matches;
  }

  private detectMouse(): boolean {
    return window.matchMedia && window.matchMedia("(hover: hover)").matches;
  }

  private detectDeviceMotion(): boolean {
    return (
      "DeviceMotionEvent" in window &&
      typeof (DeviceMotionEvent as any).requestPermission !== "function"
    );
  }

  private getConnectionType(): string {
    const connection = (navigator as any).connection;
    return connection?.type || "unknown";
  }

  private getEffectiveType(): string {
    const connection = (navigator as any).connection;
    return connection?.effectiveType || "4g";
  }

  private detectWebGL(): boolean {
    try {
      const canvas = document.createElement("canvas");
      return !!(canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
    } catch {
      return false;
    }
  }

  private detectWebGL2(): boolean {
    try {
      const canvas = document.createElement("canvas");
      return !!canvas.getContext("webgl2");
    } catch {
      return false;
    }
  }

  private async checkPersistentStorage(): Promise<boolean> {
    try {
      if ("storage" in navigator && "persist" in navigator.storage) {
        return await navigator.storage.persist();
      }
    } catch {
      // Ignore errors
    }
    return false;
  }

  private determineEnhancementLevel(capabilities: DeviceCapabilities): EnhancementLevel {
    let score = 0;

    // Performance scoring
    score += capabilities.hardwareConcurrency * 10;
    score += (capabilities.deviceMemory || 2) * 5;
    score += capabilities.isRetina ? 10 : 0;
    score += capabilities.hasHighRefreshRate ? 15 : 0;

    // Feature scoring
    score += capabilities.hasWebGL ? 10 : 0;
    score += capabilities.hasWebGL2 ? 15 : 0;
    score += capabilities.hasWebWorkers ? 10 : 0;
    score += capabilities.hasOffscreenCanvas ? 5 : 0;
    score += capabilities.hasWebAssembly ? 10 : 0;

    // Network scoring
    const networkScore = this.getNetworkScore(capabilities.effectiveType);
    score += networkScore;

    // Screen size bonus
    if (capabilities.screenSize === "large") score += 10;
    else if (capabilities.screenSize === "medium") score += 5;

    // Determine level based on score
    let level: EnhancementLevel["level"];
    if (score >= 100) level = "premium";
    else if (score >= 70) level = "enhanced";
    else if (score >= 40) level = "standard";
    else level = "minimal";

    return {
      level,
      features: this.getFeaturesForLevel(level, capabilities),
    };
  }

  private getNetworkScore(effectiveType: string): number {
    switch (effectiveType) {
      case "4g":
        return 20;
      case "3g":
        return 10;
      case "2g":
        return 0;
      case "slow-2g":
        return -10;
      default:
        return 15;
    }
  }

  private getFeaturesForLevel(
    level: EnhancementLevel["level"],
    capabilities: DeviceCapabilities,
  ): EnhancementLevel["features"] {
    const baseFeatures = {
      animations: false,
      particleEffects: false,
      complexShaders: false,
      backgroundProcessing: false,
      advancedGestures: false,
      voiceRecognition: false,
      hapticFeedback: false,
      enhancedUI: false,
    };

    switch (level) {
      case "premium":
        return {
          animations: true,
          particleEffects: capabilities.hasWebGL2,
          complexShaders: capabilities.hasWebGL2,
          backgroundProcessing: capabilities.hasWebWorkers,
          advancedGestures: capabilities.hasTouchScreen,
          voiceRecognition: capabilities.hasMediaRecorder && capabilities.isSecureContext,
          hapticFeedback: capabilities.hasTouchScreen,
          enhancedUI: true,
        };

      case "enhanced":
        return {
          animations: true,
          particleEffects: capabilities.hasWebGL,
          complexShaders: false,
          backgroundProcessing: capabilities.hasWebWorkers,
          advancedGestures: capabilities.hasTouchScreen,
          voiceRecognition: false,
          hapticFeedback: capabilities.hasTouchScreen,
          enhancedUI: true,
        };

      case "standard":
        return {
          animations: true,
          particleEffects: false,
          complexShaders: false,
          backgroundProcessing: capabilities.hasWebWorkers,
          advancedGestures: capabilities.hasTouchScreen,
          voiceRecognition: false,
          hapticFeedback: false,
          enhancedUI: false,
        };

      case "minimal":
      default:
        return baseFeatures;
    }
  }

  private applyEnhancements(): void {
    if (!this.capabilities || !this.enhancementLevel) return;

    const { level, features } = this.enhancementLevel;

    // Apply CSS custom properties for feature detection
    const root = document.documentElement;
    root.style.setProperty("--enhancement-level", level);
    root.style.setProperty("--animations-enabled", features.animations ? "1" : "0");
    root.style.setProperty("--particles-enabled", features.particleEffects ? "1" : "0");
    root.style.setProperty("--enhanced-ui", features.enhancedUI ? "1" : "0");

    // Set device capability classes
    root.classList.toggle("has-webgl", this.capabilities.hasWebGL);
    root.classList.toggle("has-webgl2", this.capabilities.hasWebGL2);
    root.classList.toggle("has-touch", this.capabilities.hasTouchScreen);
    root.classList.toggle("has-retina", this.capabilities.isRetina);
    root.classList.toggle("has-high-refresh", this.capabilities.hasHighRefreshRate);
    root.classList.toggle("enhancement-" + level, true);

    // Performance-based media queries
    if (window.matchMedia) {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion || level === "minimal") {
        root.style.setProperty("--motion-enabled", "0");
      }
    }
  }

  // Public API
  getCapabilities(): DeviceCapabilities | null {
    return this.capabilities;
  }

  getEnhancementLevel(): EnhancementLevel | null {
    return this.enhancementLevel;
  }

  isFeatureEnabled(feature: keyof EnhancementLevel["features"]): boolean {
    return this.enhancementLevel?.features[feature] || false;
  }

  onChange(
    callback: (capabilities: DeviceCapabilities, level: EnhancementLevel) => void,
  ): () => void {
    this.observers.push(callback);

    return () => {
      const index = this.observers.indexOf(callback);
      if (index > -1) {
        this.observers.splice(index, 1);
      }
    };
  }

  private notifyObservers(): void {
    if (!this.capabilities || !this.enhancementLevel) return;

    this.observers.forEach((callback) => {
      try {
        callback(this.capabilities!, this.enhancementLevel!);
      } catch (error) {
        console.error("Error in enhancement observer:", error);
      }
    });
  }
}

// Singleton instance
export const enhancementManager = new ProgressiveEnhancementManager();

// React hooks
export function useDeviceCapabilities() {
  const [capabilities, setCapabilities] = useState<DeviceCapabilities | null>(null);
  const [level, setLevel] = useState<EnhancementLevel | null>(null);

  useEffect(() => {
    const currentCapabilities = enhancementManager.getCapabilities();
    const currentLevel = enhancementManager.getEnhancementLevel();

    if (currentCapabilities && currentLevel) {
      setCapabilities(currentCapabilities);
      setLevel(currentLevel);
    }

    const unsubscribe = enhancementManager.onChange((caps, lvl) => {
      setCapabilities(caps);
      setLevel(lvl);
    });

    return unsubscribe;
  }, []);

  return { capabilities, level };
}

export function useFeature(feature: keyof EnhancementLevel["features"]): boolean {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(enhancementManager.isFeatureEnabled(feature));

    const unsubscribe = enhancementManager.onChange(() => {
      setEnabled(enhancementManager.isFeatureEnabled(feature));
    });

    return unsubscribe;
  }, [feature]);

  return enabled;
}

// Utility functions
export function isMobileDevice(): boolean {
  const capabilities = enhancementManager.getCapabilities();
  return (capabilities?.hasTouchScreen && capabilities?.screenSize === "small") || false;
}

export function isHighPerformanceDevice(): boolean {
  const level = enhancementManager.getEnhancementLevel();
  return level?.level === "premium" || level?.level === "enhanced" || false;
}

export function shouldUseReducedMotion(): boolean {
  const level = enhancementManager.getEnhancementLevel();
  return (
    level?.level === "minimal" ||
    (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) ||
    false
  );
}

export default enhancementManager;
