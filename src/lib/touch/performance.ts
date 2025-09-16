/**
 * Performance-optimierte Touch-Event-Behandlung
 */

export interface TouchPerformanceOptions {
  throttleMs?: number;
  passiveEvents?: boolean;
  enableTouchOptimizations?: boolean;
  maxTouchPoints?: number;
}

const DEFAULT_OPTIONS: Required<TouchPerformanceOptions> = {
  throttleMs: 16, // 60fps
  passiveEvents: true,
  enableTouchOptimizations: true,
  maxTouchPoints: 10,
};

/**
 * Throttled event handler mit RequestAnimationFrame
 */
export function throttledRAF<T extends unknown[]>(fn: (...args: T) => void): (...args: T) => void {
  let rafId: number | null = null;
  let lastArgs: T | null = null;

  return (...args: T) => {
    lastArgs = args;

    if (rafId === null) {
      rafId = requestAnimationFrame(() => {
        if (lastArgs) {
          fn(...lastArgs);
        }
        rafId = null;
        lastArgs = null;
      });
    }
  };
}

/**
 * Touch-Event-Pool für bessere Memory-Performance
 */
class TouchEventPool {
  private pool: Touch[] = [];
  private maxSize = 20;

  acquire(touch: Touch): Touch {
    return this.pool.pop() || touch;
  }

  release(touch: Touch): void {
    if (this.pool.length < this.maxSize) {
      this.pool.push(touch);
    }
  }

  clear(): void {
    this.pool.length = 0;
  }
}

const touchPool = new TouchEventPool();

/**
 * Performance-optimierter Touch-Handler
 */
export class PerformantTouchHandler {
  private element: HTMLElement;
  private options: Required<TouchPerformanceOptions>;
  private activeEvents = new Map<string, AbortController>();
  private isDestroyed = false;

  constructor(element: HTMLElement, options: TouchPerformanceOptions = {}) {
    this.element = element;
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.setupOptimizations();
  }

  private setupOptimizations(): void {
    if (!this.options.enableTouchOptimizations) return;

    // CSS-Transform-Optimierungen
    this.element.style.willChange = "transform";
    this.element.style.touchAction = "manipulation";

    // Hardware-Beschleunigung aktivieren
    if (this.element.style.transform === "") {
      this.element.style.transform = "translateZ(0)";
    }
  }

  /**
   * Fügt optimierten Touch-Event-Listener hinzu
   */
  addTouchListener(
    eventType: "touchstart" | "touchmove" | "touchend" | "touchcancel",
    handler: (event: TouchEvent) => void,
    options?: AddEventListenerOptions,
  ): () => void {
    if (this.isDestroyed) return () => {};

    const controller = new AbortController();
    const eventId = `${eventType}_${Date.now()}`;

    this.activeEvents.set(eventId, controller);

    const optimizedHandler =
      this.options.throttleMs > 0 && eventType === "touchmove" ? throttledRAF(handler) : handler;

    const eventOptions: AddEventListenerOptions = {
      passive: this.options.passiveEvents && eventType !== "touchstart",
      signal: controller.signal,
      ...options,
    };

    this.element.addEventListener(eventType, optimizedHandler, eventOptions);

    return () => {
      controller.abort();
      this.activeEvents.delete(eventId);
    };
  }

  /**
   * Batch-Touch-Events für bessere Performance
   */
  createBatchedTouchHandler(handlers: {
    onTouchStart?: (event: TouchEvent) => void;
    onTouchMove?: (event: TouchEvent) => void;
    onTouchEnd?: (event: TouchEvent) => void;
  }): () => void {
    const cleanup: (() => void)[] = [];

    if (handlers.onTouchStart) {
      cleanup.push(this.addTouchListener("touchstart", handlers.onTouchStart, { passive: false }));
    }

    if (handlers.onTouchMove) {
      cleanup.push(this.addTouchListener("touchmove", handlers.onTouchMove, { passive: true }));
    }

    if (handlers.onTouchEnd) {
      cleanup.push(this.addTouchListener("touchend", handlers.onTouchEnd, { passive: false }));
    }

    return () => {
      cleanup.forEach((fn) => fn());
    };
  }

  /**
   * Optimierte Touch-Koordinaten-Extraktion
   */
  static extractTouchData(event: TouchEvent): {
    primary: { x: number; y: number } | null;
    secondary: { x: number; y: number } | null;
    count: number;
  } {
    const touches = event.touches;
    const count = Math.min(touches.length, 2); // Limitiere auf 2 für Performance

    return {
      primary: count > 0 ? { x: touches[0]!.clientX, y: touches[0]!.clientY } : null,
      secondary: count > 1 ? { x: touches[1]!.clientX, y: touches[1]!.clientY } : null,
      count,
    };
  }

  /**
   * Memory-effiziente Touch-Event-Verarbeitung
   */
  processTouch(event: TouchEvent, processor: (touch: Touch, index: number) => void): void {
    const maxTouches = Math.min(event.touches.length, this.options.maxTouchPoints);

    for (let i = 0; i < maxTouches; i++) {
      const touch = touchPool.acquire(event.touches[i]!);
      try {
        processor(touch, i);
      } finally {
        touchPool.release(touch);
      }
    }
  }

  /**
   * Cleanup und Memory-Freigabe
   */
  destroy(): void {
    if (this.isDestroyed) return;

    this.isDestroyed = true;

    // Alle Event-Listener abbrechen
    this.activeEvents.forEach((controller) => controller.abort());
    this.activeEvents.clear();

    // CSS-Optimierungen zurücksetzen
    this.element.style.willChange = "";
    if (this.element.style.transform === "translateZ(0)") {
      this.element.style.transform = "";
    }

    // Touch-Pool leeren
    touchPool.clear();
  }
}

/**
 * Globale Touch-Performance-Optimierungen
 */
export class TouchPerformanceManager {
  private static instance: TouchPerformanceManager | null = null;
  private handlers = new Set<PerformantTouchHandler>();
  private isOptimized = false;

  static getInstance(): TouchPerformanceManager {
    if (!TouchPerformanceManager.instance) {
      TouchPerformanceManager.instance = new TouchPerformanceManager();
    }
    return TouchPerformanceManager.instance;
  }

  /**
   * Globale Touch-Optimierungen aktivieren
   */
  enableGlobalOptimizations(): void {
    if (this.isOptimized) return;

    // CSS-Optimierungen für bessere Touch-Performance
    const style = document.createElement("style");
    style.textContent = `
      * {
        -webkit-tap-highlight-color: transparent;
      }

      body {
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        overscroll-behavior: none;
      }

      input, textarea, [contenteditable] {
        -webkit-user-select: auto;
        -moz-user-select: auto;
        -ms-user-select: auto;
        user-select: auto;
      }

      .touch-optimized {
        transform: translateZ(0);
        will-change: transform;
        contain: layout style paint;
      }
    `;
    document.head.appendChild(style);

    // Passive Event-Listener für bessere Scroll-Performance
    document.addEventListener("touchstart", () => {}, { passive: true });
    document.addEventListener("touchmove", () => {}, { passive: true });

    this.isOptimized = true;
  }

  /**
   * Touch-Handler registrieren
   */
  registerHandler(handler: PerformantTouchHandler): void {
    this.handlers.add(handler);
  }

  /**
   * Touch-Handler deregistrieren
   */
  unregisterHandler(handler: PerformantTouchHandler): void {
    this.handlers.delete(handler);
  }

  /**
   * Alle Handler cleanup
   */
  cleanup(): void {
    this.handlers.forEach((handler) => handler.destroy());
    this.handlers.clear();
    this.isOptimized = false;
  }
}

/**
 * Hook für Performance-optimierte Touch-Events
 */
export function usePerformantTouch(
  elementRef: { current: HTMLElement | null },
  _options: TouchPerformanceOptions = {},
): PerformantTouchHandler | null {
  // React Hook-Implementierung würde hier hin
  // Für jetzt geben wir null zurück
  return null;
}
