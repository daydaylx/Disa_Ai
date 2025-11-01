/**
 * Animation Performance Utilities
 *
 * Provides performance-optimized animation utilities, GPU acceleration helpers,
 * and performance monitoring for the Universal State System.
 */

import React from "react";

/**
 * Performance-aware animation configuration
 */
export interface AnimationConfig {
  useGPU?: boolean;
  reducedMotion?: boolean;
  enablePerformanceMonitoring?: boolean;
  throttleMs?: number;
  batchUpdates?: boolean;
}

/**
 * Animation performance metrics
 */
export interface AnimationMetrics {
  frameRate: number;
  droppedFrames: number;
  animationDuration: number;
  gpuMemoryUsage?: number;
  lastFrameTime: number;
}

/**
 * Performance monitor for animations
 */
class AnimationPerformanceMonitor {
  private frameCount = 0;
  private lastTime = 0;
  private droppedFrames = 0;
  private frameRates: number[] = [];
  private isMonitoring = false;
  private animationId?: number;

  start() {
    if (this.isMonitoring) return;

    this.isMonitoring = true;
    this.frameCount = 0;
    this.lastTime = performance.now();
    this.frameRates = [];
    this.droppedFrames = 0;

    this.monitor();
  }

  stop(): AnimationMetrics {
    this.isMonitoring = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }

    const averageFrameRate =
      this.frameRates.length > 0
        ? this.frameRates.reduce((a, b) => a + b, 0) / this.frameRates.length
        : 0;

    return {
      frameRate: averageFrameRate,
      droppedFrames: this.droppedFrames,
      animationDuration: performance.now() - this.lastTime,
      lastFrameTime: this.lastTime,
    };
  }

  private monitor = () => {
    if (!this.isMonitoring) return;

    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastTime;

    if (deltaTime > 0) {
      const frameRate = 1000 / deltaTime;
      this.frameRates.push(frameRate);

      // Detect dropped frames (assuming 60fps target)
      if (frameRate < 55) {
        this.droppedFrames++;
      }

      // Keep only last 60 frame rate measurements
      if (this.frameRates.length > 60) {
        this.frameRates.shift();
      }
    }

    this.lastTime = currentTime;
    this.frameCount++;

    this.animationId = requestAnimationFrame(this.monitor);
  };

  getInstantFrameRate(): number {
    return this.frameRates.length > 0 ? this.frameRates[this.frameRates.length - 1] || 0 : 0;
  }

  getAverageFrameRate(): number {
    return this.frameRates.length > 0
      ? this.frameRates.reduce((a, b) => a + b, 0) / this.frameRates.length
      : 0;
  }
}

/**
 * Global animation performance monitor instance
 */
export const animationMonitor = new AnimationPerformanceMonitor();

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Check if device supports high refresh rate
 */
export function supportsHighRefreshRate(): Promise<boolean> {
  // Use requestAnimationFrame to detect refresh rate
  return new Promise<boolean>((resolve) => {
    let frames = 0;
    const startTime = performance.now();

    function checkFrameRate() {
      frames++;
      if (frames < 10) {
        requestAnimationFrame(checkFrameRate);
      } else {
        const duration = performance.now() - startTime;
        const fps = (frames * 1000) / duration;
        resolve(fps > 75); // Consider >75fps as high refresh rate
      }
    }

    requestAnimationFrame(checkFrameRate);
  }).catch(() => false);
}

/**
 * Optimize element for animations by setting will-change
 */
export function optimizeForAnimation(
  element: HTMLElement,
  properties: string[] = ["transform", "opacity"],
): () => void {
  const originalWillChange = element.style.willChange;
  element.style.willChange = properties.join(", ");

  // Return cleanup function
  return () => {
    element.style.willChange = originalWillChange;
  };
}

/**
 * Create a performance-optimized animation using requestAnimationFrame
 */
export function createOptimizedAnimation(
  element: HTMLElement,
  keyframes: Keyframe[],
  options: KeyframeAnimationOptions & AnimationConfig = {},
): Animation {
  const {
    useGPU = true,
    reducedMotion = prefersReducedMotion(),
    enablePerformanceMonitoring = false,
    ...animationOptions
  } = options;

  // Apply GPU acceleration if requested
  let cleanup: (() => void) | undefined;
  if (useGPU) {
    cleanup = optimizeForAnimation(element, ["transform", "opacity", "filter", "backdrop-filter"]);
  }

  // Modify animation for reduced motion
  let finalKeyframes = keyframes;
  let finalOptions = animationOptions;

  if (reducedMotion) {
    // Reduce or eliminate motion-based transforms
    finalKeyframes = keyframes.map((frame) => ({
      ...frame,
      transform:
        typeof frame.transform === "string"
          ? frame.transform.replace(/translate[XYZ]?\([^)]*\)/g, "")
          : frame.transform,
    }));

    // Reduce duration for reduced motion
    finalOptions = {
      ...animationOptions,
      duration:
        typeof animationOptions.duration === "number"
          ? Math.min(animationOptions.duration, 200)
          : 200,
    };
  }

  // Start performance monitoring if enabled
  if (enablePerformanceMonitoring) {
    animationMonitor.start();
  }

  // Create the animation
  const animation = element.animate(finalKeyframes, finalOptions);

  // Handle animation completion
  animation.addEventListener("finish", () => {
    cleanup?.();
    if (enablePerformanceMonitoring) {
      const metrics = animationMonitor.stop();
      if (process.env.NODE_ENV === "development") {
        console.warn("Animation Performance Metrics:", metrics);
      }
    }
  });

  animation.addEventListener("cancel", () => {
    cleanup?.();
    if (enablePerformanceMonitoring) {
      animationMonitor.stop();
    }
  });

  return animation;
}

/**
 * Debounce function for animation triggers
 */
export function debounceAnimation<T extends (...args: any[]) => any>(func: T, delay: number): T {
  let timeoutId: NodeJS.Timeout;

  return ((...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  }) as T;
}

/**
 * Throttle function for animation updates
 */
export function throttleAnimation<T extends (...args: any[]) => any>(func: T, limit: number): T {
  let lastFunc: NodeJS.Timeout;
  let lastRan: number;

  return ((...args: Parameters<T>) => {
    if (!lastRan) {
      func(...args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(
        () => {
          if (Date.now() - lastRan >= limit) {
            func(...args);
            lastRan = Date.now();
          }
        },
        limit - (Date.now() - lastRan),
      );
    }
  }) as T;
}

/**
 * Batch DOM updates for better performance
 */
export class DOMUpdateBatcher {
  private updates: (() => void)[] = [];
  private isScheduled = false;

  add(update: () => void) {
    this.updates.push(update);
    this.scheduleFlush();
  }

  private scheduleFlush() {
    if (this.isScheduled) return;

    this.isScheduled = true;
    requestAnimationFrame(() => {
      const updates = this.updates.splice(0);
      updates.forEach((update) => update());
      this.isScheduled = false;
    });
  }

  flush() {
    if (this.updates.length === 0) return;

    const updates = this.updates.splice(0);
    updates.forEach((update) => update());
    this.isScheduled = false;
  }
}

/**
 * Global DOM update batcher
 */
export const domBatcher = new DOMUpdateBatcher();

/**
 * Performance-optimized CSS class toggler
 */
export function optimizedClassToggle(
  element: HTMLElement,
  className: string,
  force?: boolean,
): void {
  domBatcher.add(() => {
    if (force !== undefined) {
      element.classList.toggle(className, force);
    } else {
      element.classList.toggle(className);
    }
  });
}

/**
 * Check if an element is visible in viewport (for animation optimization)
 */
export function isElementVisible(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;

  return (
    rect.bottom >= 0 && rect.right >= 0 && rect.top <= windowHeight && rect.left <= windowWidth
  );
}

/**
 * Intersection Observer for animation optimization
 */
export class AnimationVisibilityObserver {
  private observer: IntersectionObserver;
  private callbacks = new Map<Element, (isVisible: boolean) => void>();

  constructor(threshold = 0.1) {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const callback = this.callbacks.get(entry.target);
          if (callback) {
            callback(entry.isIntersecting);
          }
        });
      },
      { threshold },
    );
  }

  observe(element: Element, callback: (isVisible: boolean) => void) {
    this.callbacks.set(element, callback);
    this.observer.observe(element);
  }

  unobserve(element: Element) {
    this.callbacks.delete(element);
    this.observer.unobserve(element);
  }

  disconnect() {
    this.observer.disconnect();
    this.callbacks.clear();
  }
}

/**
 * Global visibility observer for animations
 */
export const animationVisibilityObserver = new AnimationVisibilityObserver();

/**
 * Performance-aware animation hook
 */
export function usePerformantAnimation() {
  const [isOptimized, setIsOptimized] = React.useState(false);
  const [metrics, setMetrics] = React.useState<AnimationMetrics | null>(null);

  React.useEffect(() => {
    // Check device capabilities
    const checkPerformance = async () => {
      const supportsHRR = await supportsHighRefreshRate();
      const reducedMotion = prefersReducedMotion();

      setIsOptimized(!reducedMotion && supportsHRR);
    };

    void checkPerformance();
  }, []);

  const createAnimation = React.useCallback(
    (
      element: HTMLElement,
      keyframes: Keyframe[],
      options: KeyframeAnimationOptions & AnimationConfig = {},
    ) => {
      return createOptimizedAnimation(element, keyframes, {
        ...options,
        useGPU: isOptimized,
        enablePerformanceMonitoring: process.env.NODE_ENV === "development",
      });
    },
    [isOptimized],
  );

  const startMonitoring = React.useCallback(() => {
    animationMonitor.start();
  }, []);

  const stopMonitoring = React.useCallback(() => {
    const newMetrics = animationMonitor.stop();
    setMetrics(newMetrics);
    return newMetrics;
  }, []);

  return {
    isOptimized,
    metrics,
    createAnimation,
    startMonitoring,
    stopMonitoring,
    prefersReducedMotion: prefersReducedMotion(),
  };
}

/**
 * CSS custom properties for performance-optimized animations
 */
export const performanceCSS = `
  :root {
    /* GPU-accelerated transforms */
    --transform-gpu: translate3d(0, 0, 0);
    --will-change-transform: transform;
    --will-change-opacity: opacity;
    --will-change-auto: auto;

    /* Performance-optimized durations based on device */
    --duration-performance-optimized: clamp(120ms, 0.5vw, 300ms);
    --duration-reduced-motion: 120ms;

    /* Hardware acceleration helpers */
    --gpu-layer: translateZ(0);
    --gpu-backface: hidden;
  }

  /* Performance optimization classes */
  .gpu-accelerated {
    transform: var(--transform-gpu);
    will-change: var(--will-change-transform);
    backface-visibility: var(--gpu-backface);
  }

  .will-change-transform {
    will-change: var(--will-change-transform);
  }

  .will-change-opacity {
    will-change: var(--will-change-opacity);
  }

  .will-change-auto {
    will-change: var(--will-change-auto);
  }

  /* Performance-aware animation classes */
  @media (prefers-reduced-motion: no-preference) {
    .performance-animation {
      transition-duration: var(--duration-performance-optimized);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .performance-animation {
      transition-duration: var(--duration-reduced-motion);
    }
  }
`;
