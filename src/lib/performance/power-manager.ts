/**
 * Power Management für Premium Effects - Adaptive UI-Performance
 */

import { useEffect, useState } from "react";
import { createObserverManager } from "../observer";

interface PowerState {
  level: "high" | "medium" | "low" | "critical";
  battery: number;
  charging: boolean;
  effectsEnabled: boolean;
  animationsEnabled: boolean;
  particlesEnabled: boolean;
  matrixRainEnabled: boolean;
}

interface PerformanceMetrics {
  fps: number;
  memoryUsage: number;
  cpuUsage: number;
  thermalState: "nominal" | "elevated" | "serious" | "critical";
}

import { createObserverManager } from "../observer";

class PowerManager {
  private state: PowerState = {
    level: "high",
    battery: 100,
    charging: true,
    effectsEnabled: true,
    animationsEnabled: true,
    particlesEnabled: true,
    matrixRainEnabled: true,
  };

  private metrics: PerformanceMetrics = {
    fps: 60,
    memoryUsage: 0,
    cpuUsage: 0,
    thermalState: "nominal",
  };

  private observerManager = createObserverManager<PowerState>();
  private perfObserver: PerformanceObserver | null = null;
  private batteryCheckInterval: ReturnType<typeof setInterval> | null = null;
  private fpsCounter = 0;
  private lastFpsTime = performance.now();

  constructor() {
    void this.initBatteryMonitoring();
    this.initPerformanceMonitoring();
    this.setupAdaptiveSettings();
  }

  private async initBatteryMonitoring(): Promise<void> {
    try {
      if ("getBattery" in navigator) {
        const battery = await (navigator as any).getBattery();

        this.updateBatteryState(battery);

        battery.addEventListener("chargingchange", () => void this.updateBatteryState(battery));
        battery.addEventListener("levelchange", () => void this.updateBatteryState(battery));

        // Regelmäßige Battery-Checks
        this.batteryCheckInterval = setInterval(() => {
          void this.updateBatteryState(battery);
        }, 30000);
      }
    } catch {
      console.warn("Battery API not supported");
    }
  }

  private updateBatteryState(battery: any): void {
    const level = battery.level;
    const charging = battery.charging;

    this.state.battery = Math.round(level * 100);
    this.state.charging = charging;

    // Power Level basierend auf Battery
    if (!charging && level < 0.15) {
      this.state.level = "critical";
    } else if (!charging && level < 0.3) {
      this.state.level = "low";
    } else if (!charging && level < 0.6) {
      this.state.level = "medium";
    } else {
      this.state.level = "high";
    }

    this.adaptEffectsToResourceState();
    this.observerManager.notify(this.state);
  }

  private initPerformanceMonitoring(): void {
    // FPS Monitoring
    this.startFpsMonitoring();

    // Memory Monitoring
    if ("memory" in performance) {
      setInterval(() => {
        const memory = (performance as any).memory;
        this.metrics.memoryUsage = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
      }, 5000);
    }

    // Performance Observer für Long Tasks
    try {
      this.perfObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === "longtask") {
            this.handleLongTask(entry);
          }
        }
      });

      this.perfObserver.observe({ entryTypes: ["longtask"] });
    } catch {
      console.warn("PerformanceObserver not supported");
    }
  }

  private startFpsMonitoring(): void {
    const measureFps = () => {
      this.fpsCounter++;
      const now = performance.now();

      if (now >= this.lastFpsTime + 1000) {
        this.metrics.fps = Math.round((this.fpsCounter * 1000) / (now - this.lastFpsTime));
        this.fpsCounter = 0;
        this.lastFpsTime = now;

        // Performance-basierte Anpassungen
        if (this.metrics.fps < 30) {
          this.handleLowPerformance();
        } else if (this.metrics.fps > 55) {
          this.handleGoodPerformance();
        }
      }

      requestAnimationFrame(measureFps);
    };

    requestAnimationFrame(measureFps);
  }

  private handleLongTask(entry: PerformanceEntry): void {
    if (entry.duration > 100) {
      this.metrics.cpuUsage = Math.min(100, this.metrics.cpuUsage + 10);
      this.handleHighCpuUsage();
    }
  }

  private handleLowPerformance(): void {
    if (this.state.effectsEnabled) {
      this.state.particlesEnabled = false;
      this.state.matrixRainEnabled = false;
      this.observerManager.notify(this.state);
    }
  }

  private handleGoodPerformance(): void {
    if (this.state.level === "high" && this.state.effectsEnabled) {
      this.state.particlesEnabled = true;
      this.state.matrixRainEnabled = true;
      this.observerManager.notify(this.state);
    }
  }

  private handleHighCpuUsage(): void {
    if (this.metrics.cpuUsage > 80) {
      this.state.animationsEnabled = false;
      this.state.particlesEnabled = false;
    }

    // CPU-Entlastung nach einiger Zeit
    setTimeout(() => {
      this.metrics.cpuUsage = Math.max(0, this.metrics.cpuUsage - 20);
      if (this.metrics.cpuUsage < 50) {
        this.restoreEffects();
      }
    }, 5000);
  }

  private adaptEffectsToResourceState(): void {
    switch (this.state.level) {
      case "critical":
        this.state.effectsEnabled = false;
        this.state.animationsEnabled = false;
        this.state.particlesEnabled = false;
        this.state.matrixRainEnabled = false;
        break;

      case "low":
        this.state.effectsEnabled = true;
        this.state.animationsEnabled = false;
        this.state.particlesEnabled = false;
        this.state.matrixRainEnabled = false;
        break;

      case "medium":
        this.state.effectsEnabled = true;
        this.state.animationsEnabled = true;
        this.state.particlesEnabled = false;
        this.state.matrixRainEnabled = false;
        break;

      case "high":
        this.state.effectsEnabled = true;
        this.state.animationsEnabled = true;
        this.state.particlesEnabled = true;
        this.state.matrixRainEnabled = true;
        break;
    }
  }

  private restoreEffects(): void {
    if (this.state.level === "high" && this.metrics.fps > 45) {
      this.state.animationsEnabled = true;
      this.state.particlesEnabled = true;
      this.observerManager.notify(this.state);
    }
  }

  private setupAdaptiveSettings(): void {
    // CSS Custom Properties für adaptive Effekte
    const updateCSSProperties = () => {
      document.documentElement.style.setProperty(
        "--effects-enabled",
        this.state.effectsEnabled ? "1" : "0",
      );

      document.documentElement.style.setProperty(
        "--animations-enabled",
        this.state.animationsEnabled ? "1" : "0",
      );

      document.documentElement.style.setProperty(
        "--particles-enabled",
        this.state.particlesEnabled ? "1" : "0",
      );

      document.documentElement.style.setProperty("--power-level", this.state.level);
    };

    this.onStateChange(updateCSSProperties);
    updateCSSProperties();
  }

  // Public API
  onStateChange(callback: (state: PowerState) => void): () => void {
    return this.observerManager.subscribe(callback);
  }

  getCurrentState(): PowerState {
    return { ...this.state };
  }

  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  forceLevel(level: PowerState["level"]): void {
    this.state.level = level;
    this.adaptEffectsToResourceState();
    this.observerManager.notify(this.state);
  }

  enableEffect(
    effect: keyof Pick<
      PowerState,
      "effectsEnabled" | "animationsEnabled" | "particlesEnabled" | "matrixRainEnabled"
    >,
  ): void {
    if (this.state.level !== "critical") {
      this.state[effect] = true;
      this.observerManager.notify(this.state);
    }
  }

  disableEffect(
    effect: keyof Pick<
      PowerState,
      "effectsEnabled" | "animationsEnabled" | "particlesEnabled" | "matrixRainEnabled"
    >,
  ): void {
    this.state[effect] = false;
    this.observerManager.notify(this.state);
  }

  destroy(): void {
    if (this.batteryCheckInterval) {
      clearInterval(this.batteryCheckInterval);
    }

    if (this.perfObserver) {
      this.perfObserver.disconnect();
    }

    this.observerManager.destroy();
  }
}

// Singleton instance
export const powerManager = new PowerManager();

// React hook for power management
export function usePowerState() {
  const [state, setState] = useState(() => powerManager.getCurrentState());

  useEffect(() => {
    const unsubscribe = powerManager.onStateChange(setState);
    return unsubscribe;
  }, []);

  return state;
}

// Utility functions
export function shouldReduceMotion(): boolean {
  const state = powerManager.getCurrentState();
  return !state.animationsEnabled || state.level === "critical";
}

export function shouldDisableParticles(): boolean {
  const state = powerManager.getCurrentState();
  return !state.particlesEnabled;
}

export function shouldDisableComplexEffects(): boolean {
  const state = powerManager.getCurrentState();
  return state.level === "low" || state.level === "critical";
}

export default powerManager;
