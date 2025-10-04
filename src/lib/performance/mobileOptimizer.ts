/**
 * Mobile Performance Optimizer
 * Sammelt und optimiert verschiedene Performance-Aspekte für Mobile
 */

export interface MobilePerformanceMetrics {
  fps: number;
  memoryUsage: number;
  loadTime: number;
  renderTime: number;
  touchLatency: number;
  networkLatency: number;
}

export interface OptimizationOptions {
  enableFPSMonitoring?: boolean;
  enableMemoryOptimization?: boolean;
  enableTouchOptimization?: boolean;
  enableRenderOptimization?: boolean;
  enableNetworkOptimization?: boolean;
  maxFPS?: number;
  memoryThreshold?: number;
}

const DEFAULT_OPTIONS: Required<OptimizationOptions> = {
  enableFPSMonitoring: true,
  enableMemoryOptimization: true,
  enableTouchOptimization: true,
  enableRenderOptimization: true,
  enableNetworkOptimization: true,
  maxFPS: 60,
  memoryThreshold: 50 * 1024 * 1024, // 50MB
};

/**
 * Mobile Performance Optimizer
 */
export class MobilePerformanceOptimizer {
  private static instance: MobilePerformanceOptimizer | null = null;
  private options: Required<OptimizationOptions>;
  private metrics: Partial<MobilePerformanceMetrics> = {};
  private observers: { [key: string]: any } = {};
  private isEnabled = true;

  static getInstance(options: OptimizationOptions = {}): MobilePerformanceOptimizer {
    if (!MobilePerformanceOptimizer.instance) {
      MobilePerformanceOptimizer.instance = new MobilePerformanceOptimizer(options);
    }
    return MobilePerformanceOptimizer.instance;
  }

  private constructor(options: OptimizationOptions = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.initialize();
  }

  /**
   * Optimizer initialisieren
   */
  private initialize(): void {
    if (!this.isEnabled) return;

    this.setupFPSMonitoring();
    this.setupMemoryOptimization();
    this.setupTouchOptimization();
    this.setupRenderOptimization();
    this.setupNetworkOptimization();

    // Performance-Metriken initial sammeln
    this.collectInitialMetrics();
  }

  /**
   * FPS-Monitoring einrichten
   */
  private setupFPSMonitoring(): void {
    if (!this.options.enableFPSMonitoring) return;

    let frameCount = 0;
    let lastTime = performance.now();

    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();

      if (currentTime - lastTime >= 1000) {
        this.metrics.fps = frameCount;
        frameCount = 0;
        lastTime = currentTime;

        // FPS-Warnung bei niedrigen Werten
        if (this.metrics.fps < 30) {
          this.optimizeFPS();
        }
      }

      requestAnimationFrame(measureFPS);
    };

    requestAnimationFrame(measureFPS);
  }

  /**
   * Memory-Optimierung
   */
  private setupMemoryOptimization(): void {
    if (!this.options.enableMemoryOptimization) return;

    // Performance Observer für Memory
    if ("memory" in performance) {
      setInterval(() => {
        const memory = (performance as any).memory;
        this.metrics.memoryUsage = memory.usedJSHeapSize;

        if (memory.usedJSHeapSize > this.options.memoryThreshold) {
          this.optimizeMemory();
        }
      }, 5000);
    }
  }

  /**
   * Touch-Optimierung
   */
  private setupTouchOptimization(): void {
    if (!this.options.enableTouchOptimization) return;

    // Touch-Latenz messen
    let touchStartTime = 0;

    document.addEventListener(
      "touchstart",
      () => {
        touchStartTime = performance.now();
      },
      { passive: true },
    );

    document.addEventListener(
      "touchend",
      () => {
        if (touchStartTime > 0) {
          this.metrics.touchLatency = performance.now() - touchStartTime;
          touchStartTime = 0;
        }
      },
      { passive: true },
    );

    // Touch-Optimierungen aktivieren
    this.enableTouchOptimizations();
  }

  /**
   * Render-Optimierung
   */
  private setupRenderOptimization(): void {
    if (!this.options.enableRenderOptimization) return;

    // Render-Performance überwachen
    if ("PerformanceObserver" in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        for (const entry of entries) {
          if (entry.entryType === "paint") {
            this.metrics.renderTime = entry.startTime;
          }
        }
      });

      observer.observe({ entryTypes: ["paint", "layout-shift"] });
      this.observers.render = observer;
    }

    this.enableRenderOptimizations();
  }

  /**
   * Network-Optimierung
   */
  private setupNetworkOptimization(): void {
    if (!this.options.enableNetworkOptimization) return;

    // Network-Latenz messen
    if ("connection" in navigator) {
      const connection = (navigator as any).connection;
      this.metrics.networkLatency = connection.rtt || 0;

      connection.addEventListener("change", () => {
        this.metrics.networkLatency = connection.rtt || 0;
        this.optimizeForConnection();
      });
    }
  }

  /**
   * Initial Performance-Metriken sammeln
   */
  private collectInitialMetrics(): void {
    // Load-Time
    if ("loadEventEnd" in performance.timing) {
      const timing = performance.timing;
      this.metrics.loadTime = timing.loadEventEnd - timing.navigationStart;
    }

    // Navigation API
    if ("getEntriesByType" in performance) {
      const navigation = performance.getEntriesByType("navigation")[0] as any;
      if (navigation) {
        this.metrics.loadTime = navigation.loadEventEnd - navigation.fetchStart;
      }
    }
  }

  /**
   * FPS optimieren
   */
  private optimizeFPS(): void {
    // Animationen reduzieren
    document.documentElement.style.setProperty("--animation-speed", "0.5");

    // Blur-Effekte reduzieren
    const blurElements = document.querySelectorAll("[style*='blur']");
    blurElements.forEach((el) => {
      (el as HTMLElement).style.filter = "blur(5px)";
    });

    // Opacity-Animationen bevorzugen
    document.documentElement.classList.add("low-fps-mode");
  }

  /**
   * Memory optimieren
   */
  private optimizeMemory(): void {
    // Garbage Collection anfordern (wenn verfügbar)
    if ("gc" in window) {
      (window as any).gc();
    }

    // Große DOM-Elemente verstecken/entfernen
    const heavyElements = document.querySelectorAll("[data-heavy]");
    heavyElements.forEach((el) => {
      (el as HTMLElement).style.display = "none";
    });

    // Cache leeren
    if ("caches" in window) {
      void caches.keys().then((names) => {
        names.forEach((name) => {
          if (name.includes("old") || name.includes("temp")) {
            void caches.delete(name);
          }
        });
      });
    }
  }

  /**
   * Touch-Optimierungen aktivieren
   */
  private enableTouchOptimizations(): void {
    // Passive Event-Listener
    const style = document.createElement("style");
    style.textContent = `
      * {
        touch-action: manipulation;
        -webkit-tap-highlight-color: transparent;
      }

      input, textarea, select {
        touch-action: auto;
      }

      .scrollable {
        -webkit-overflow-scrolling: touch;
        overscroll-behavior: contain;
      }
    `;
    document.head.appendChild(style);

    // Fast-Click Behavior
    document.addEventListener(
      "touchstart",
      () => {
        document.documentElement.classList.add("touch-active");
      },
      { passive: true },
    );

    document.addEventListener(
      "touchend",
      () => {
        setTimeout(() => {
          document.documentElement.classList.remove("touch-active");
        }, 100);
      },
      { passive: true },
    );
  }

  /**
   * Render-Optimierungen aktivieren
   */
  private enableRenderOptimizations(): void {
    // CSS Containment
    const style = document.createElement("style");
    style.textContent = `
      .optimize-render {
        contain: layout style paint;
        will-change: transform;
      }

      .optimize-scroll {
        contain: layout;
        -webkit-transform: translateZ(0);
        transform: translateZ(0);
      }

      /* Layer-Promotion für häufig animierte Elemente */
      .animate-element {
        will-change: transform, opacity;
        transform: translateZ(0);
      }
    `;
    document.head.appendChild(style);

    // Automatische Optimierung für große Listen
    document.querySelectorAll("ul, ol").forEach((list) => {
      if (list.children.length > 50) {
        list.classList.add("optimize-scroll");
      }
    });
  }

  /**
   * Für aktuelle Verbindung optimieren
   */
  private optimizeForConnection(): void {
    if (!("connection" in navigator)) return;

    const connection = (navigator as any).connection;
    const effectiveType = connection.effectiveType;

    switch (effectiveType) {
      case "slow-2g":
      case "2g":
        this.enableLowBandwidthMode();
        break;
      case "3g":
        this.enableMediumBandwidthMode();
        break;
      case "4g":
      default:
        this.enableHighBandwidthMode();
        break;
    }
  }

  /**
   * Low-Bandwidth Modus
   */
  private enableLowBandwidthMode(): void {
    document.documentElement.classList.add("low-bandwidth");

    // Bilder komprimieren/entfernen
    const images = document.querySelectorAll("img");
    images.forEach((img) => {
      img.loading = "lazy";
      if (img.dataset.lowQuality) {
        img.src = img.dataset.lowQuality;
      }
    });

    // Animationen deaktivieren
    document.documentElement.style.setProperty("--animation-duration", "0s");
  }

  /**
   * Medium-Bandwidth Modus
   */
  private enableMediumBandwidthMode(): void {
    document.documentElement.classList.add("medium-bandwidth");
    document.documentElement.style.setProperty("--animation-duration", "0.2s");
  }

  /**
   * High-Bandwidth Modus
   */
  private enableHighBandwidthMode(): void {
    document.documentElement.classList.remove("low-bandwidth", "medium-bandwidth");
    document.documentElement.style.setProperty("--animation-duration", "0.3s");
  }

  /**
   * Aktuelle Metriken abrufen
   */
  getMetrics(): Partial<MobilePerformanceMetrics> {
    return { ...this.metrics };
  }

  /**
   * Performance-Report generieren
   */
  generateReport(): {
    metrics: Partial<MobilePerformanceMetrics>;
    recommendations: string[];
    score: number;
  } {
    const recommendations: string[] = [];
    let score = 100;

    // FPS-Bewertung
    if (this.metrics.fps && this.metrics.fps < 30) {
      recommendations.push("FPS zu niedrig - Animationen reduzieren");
      score -= 20;
    }

    // Memory-Bewertung
    if (this.metrics.memoryUsage && this.metrics.memoryUsage > this.options.memoryThreshold) {
      recommendations.push("Memory-Verbrauch zu hoch - Cache leeren");
      score -= 15;
    }

    // Touch-Latenz
    if (this.metrics.touchLatency && this.metrics.touchLatency > 100) {
      recommendations.push("Touch-Latenz zu hoch - Event-Handler optimieren");
      score -= 10;
    }

    // Load-Time
    if (this.metrics.loadTime && this.metrics.loadTime > 3000) {
      recommendations.push("Ladezeit zu lang - Bundle-Größe reduzieren");
      score -= 15;
    }

    return {
      metrics: this.metrics,
      recommendations,
      score: Math.max(0, score),
    };
  }

  /**
   * Optimizer aktivieren/deaktivieren
   */
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    if (enabled) {
      this.initialize();
    } else {
      this.cleanup();
    }
  }

  /**
   * Cleanup
   */
  private cleanup(): void {
    Object.values(this.observers).forEach((observer) => {
      if (observer && typeof observer.disconnect === "function") {
        observer.disconnect();
      }
    });
    this.observers = {};
  }

  /**
   * Vollständiges Cleanup
   */
  destroy(): void {
    this.cleanup();
    MobilePerformanceOptimizer.instance = null;
  }
}

/**
 * Globaler Performance-Optimizer
 */
export const mobilePerformance = {
  getInstance: (options?: OptimizationOptions) => MobilePerformanceOptimizer.getInstance(options),

  optimize: () => {
    const optimizer = MobilePerformanceOptimizer.getInstance();
    return optimizer.generateReport();
  },

  getMetrics: () => {
    const optimizer = MobilePerformanceOptimizer.getInstance();
    return optimizer.getMetrics();
  },
};
