/**
 * Cross-Device Compatibility and Responsive Utilities
 *
 * Provides responsive utilities and device detection for consistent behavior
 * across different screen sizes, device types, and input methods.
 */

export type DeviceType = "mobile" | "tablet" | "desktop" | "large-desktop";
export type Orientation = "landscape" | "portrait";
export type InputMethod = "touch" | "mouse" | "keyboard" | "stylus";

// Breakpoint definitions (in pixels)
export const BREAKPOINTS = {
  xs: 475,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

export class DeviceUtils {
  /**
   * Get the current device type based on screen width
   */
  static getDeviceType(): DeviceType {
    const width = window.innerWidth;

    if (width < BREAKPOINTS.md) {
      return "mobile";
    } else if (width < BREAKPOINTS.lg) {
      return "tablet";
    } else if (width < BREAKPOINTS.xl) {
      return "desktop";
    } else {
      return "large-desktop";
    }
  }

  /**
   * Check if the current device is mobile-sized
   */
  static isMobile(): boolean {
    return window.innerWidth < BREAKPOINTS.md;
  }

  /**
   * Check if the current device is tablet-sized
   */
  static isTablet(): boolean {
    const width = window.innerWidth;
    return width >= BREAKPOINTS.md && width < BREAKPOINTS.lg;
  }

  /**
   * Check if the current device is desktop-sized
   */
  static isDesktop(): boolean {
    return window.innerWidth >= BREAKPOINTS.lg;
  }

  /**
   * Get the current screen orientation
   */
  static getOrientation(): Orientation {
    return window.innerHeight > window.innerWidth ? "portrait" : "landscape";
  }

  /**
   * Check if device has touch capabilities
   */
  static hasTouch(): boolean {
    return "ontouchstart" in window || navigator.maxTouchPoints > 0;
  }

  /**
   * Check if device has pointer (mouse/touch/stylus)
   */
  static hasPointer(): boolean {
    return "PointerEvent" in window;
  }

  /**
   * Get the primary input method based on media queries
   */
  static getPrimaryInputMethod(): InputMethod {
    if (window.matchMedia("(pointer: coarse)").matches) {
      return "touch";
    } else if (window.matchMedia("(pointer: fine)").matches) {
      return "mouse";
    } else if (window.matchMedia("(any-pointer: coarse)").matches) {
      return "touch";
    } else if (window.matchMedia("(any-pointer: fine)").matches) {
      return "mouse";
    } else {
      return "keyboard"; // Default fallback
    }
  }

  /**
   * Check if device supports hover
   */
  static supportsHover(): boolean {
    return window.matchMedia("(hover: hover)").matches;
  }

  /**
   * Check if device is in standalone mode (PWA)
   */
  static isStandalone(): boolean {
    return (
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true ||
      document.referrer.includes("android-app://")
    );
  }

  /**
   * Get the safe area insets for mobile devices
   */
  static getSafeAreaInsets(): { top: number; right: number; bottom: number; left: number } {
    const top = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue("--safe-area-top") || "0",
      10,
    );
    const right = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue("--safe-area-right") || "0",
      10,
    );
    const bottom = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue("--safe-area-bottom") || "0",
      10,
    );
    const left = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue("--safe-area-left") || "0",
      10,
    );

    return { top, right, bottom, left };
  }

  /**
   * Calculate available view height accounting for safe areas and virtual keyboard
   */
  static getAvailableHeight(): number {
    const safeArea = this.getSafeAreaInsets();
    const viewportHeight = window.innerHeight;

    // Calculate the safe height considering the safe areas
    return viewportHeight - safeArea.top - safeArea.bottom;
  }

  /**
   * Optimize viewport for mobile devices
   */
  static optimizeViewport(): void {
    // Update the CSS variable for dynamic viewport height
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);

    // Listen for resize/orientation changes to update the variable
    const updateViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    window.addEventListener("resize", updateViewportHeight);
    window.addEventListener("orientationchange", () => {
      setTimeout(updateViewportHeight, 300); // Delay to account for animation
    });
  }

  /**
   * Check if app is running in an iframe (embedded)
   */
  static isEmbedded(): boolean {
    try {
      return window.self !== window.top;
    } catch {
      // If we can't determine, assume it's embedded to be safe
      return true;
    }
  }

  /**
   * Enable or disable overscroll behavior for mobile devices
   */
  static toggleOverscrollBehavior(enabled: boolean): void {
    if (enabled) {
      // Re-enable overscroll (default browser behavior)
      document.documentElement.style.overflow = "";
    } else {
      // Disable overscroll to prevent browser navigation gestures
      document.documentElement.style.overflow = "auto";
      (document.documentElement.style as any).webkitOverflowScrolling = "touch";
      document.documentElement.style.touchAction = "manipulation";
    }
  }

  /**
   * Add a class based on device type for CSS targeting
   */
  static updateDeviceTypeClass(): void {
    const deviceType = this.getDeviceType();
    const orientation = this.getOrientation();

    // Remove all device classes
    document.documentElement.classList.remove(
      "device-mobile",
      "device-tablet",
      "device-desktop",
      "device-large-desktop",
      "orientation-portrait",
      "orientation-landscape",
    );

    // Add current device class
    document.documentElement.classList.add(`device-${deviceType}`);
    document.documentElement.classList.add(`orientation-${orientation}`);
  }

  /**
   * Throttle a function to improve performance on resize events
   */
  static throttle(func: (...args: any[]) => void, limit: number): (...args: any[]) => void {
    let inThrottle: boolean;
    return function (this: any, ...args: any[]) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  /**
   * Debounce a function to improve performance on frequent events
   */
  static debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number,
  ): (...args: Parameters<T>) => void {
    let timeout: number | null = null;
    return function (...args: Parameters<T>) {
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = window.setTimeout(() => func(...args), wait);
    };
  }

  /**
   * Initialize responsive utilities
   */
  static initializeResponsiveBehavior(): void {
    // Update device type class
    this.updateDeviceTypeClass();

    // Optimize viewport
    this.optimizeViewport();

    // Listen for resize events to update device classes
    window.addEventListener(
      "resize",
      this.throttle(() => {
        this.updateDeviceTypeClass();
      }, 250),
    );

    // Listen for orientation changes
    window.addEventListener("orientationchange", () => {
      this.updateDeviceTypeClass();
    });

    // Set initial overscroll behavior for mobile
    if (this.hasTouch()) {
      this.toggleOverscrollBehavior(false);
    }
  }
}

// Initialize responsive behavior when DOM is ready
if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      DeviceUtils.initializeResponsiveBehavior();
    });
  } else {
    // Document already loaded
    DeviceUtils.initializeResponsiveBehavior();
  }
}

// Export individual functions for use in React hooks if needed
export const {
  getDeviceType,
  isMobile,
  isTablet,
  isDesktop,
  getOrientation,
  hasTouch,
  getPrimaryInputMethod,
  supportsHover,
  isStandalone,
  getSafeAreaInsets,
  getAvailableHeight,
  optimizeViewport,
  isEmbedded,
  toggleOverscrollBehavior,
  updateDeviceTypeClass,
} = DeviceUtils;
