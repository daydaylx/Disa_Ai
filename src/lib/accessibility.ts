/**
 * Accessibility and Device Compatibility Enhancements
 *
 * Comprehensive utility to enhance accessibility across devices and ensure
 * compatibility with assistive technologies and various device capabilities.
 */

// Types for accessibility preferences
export type ReducedMotionPreference = "reduce" | "no-preference";
export type ContrastPreference = "high" | "low" | "no-preference";
export type ColorSchemePreference = "light" | "dark" | "no-preference";
export type PointerPreference = "fine" | "coarse" | "none";

// Enhanced accessibility utilities
export class AccessibilityUtils {
  /**
   * Check if reduced motion is preferred by the user
   */
  static prefersReducedMotion(): boolean {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  /**
   * Check if high contrast is preferred
   */
  static prefersHighContrast(): boolean {
    return window.matchMedia("(prefers-contrast: high)").matches;
  }

  /**
   * Check if forced colors are enabled (Windows High Contrast Mode)
   */
  static isForcedColors(): boolean {
    return window.matchMedia("(forced-colors: active)").matches;
  }

  /**
   * Check pointer precision (coarse for touch, fine for mouse)
   */
  static getPointerPrecision(): PointerPreference {
    if (window.matchMedia("(pointer: fine)").matches) return "fine";
    if (window.matchMedia("(pointer: coarse)").matches) return "coarse";
    return "none";
  }

  /**
   * Check for screen reader users by detecting landmark navigation
   */
  static isScreenReaderUser(): boolean {
    // Check if focus is managed programmatically (common in SRs)
    const focusElement = document.activeElement;
    if (focusElement && focusElement.tagName === "BODY") {
      return true;
    }

    // Additional heuristics can be added here
    return false;
  }

  /**
   * Apply accessibility enhancements to the DOM
   */
  static applyAccessibilityEnhancements(): void {
    // Add landmarks for screen reader navigation
    this.addLandmarks();

    // Enhance focus indicators for low-vision users
    this.enhanceFocusIndicators();

    // Apply reduced motion styles if preferred
    this.applyReducedMotion();

    // Apply high contrast styles if preferred
    this.applyHighContrast();

    // Ensure proper touch target sizes
    this.ensureTouchTargets();
  }

  /**
   * Add ARIA landmarks for better screen reader navigation
   */
  private static addLandmarks(): void {
    const header = document.querySelector("header");
    const main = document.querySelector("main");
    const footer = document.querySelector("footer");
    const nav = document.querySelector("nav");

    if (header && !header.hasAttribute("role")) {
      header.setAttribute("role", "banner");
    }

    if (main && !main.hasAttribute("role")) {
      main.setAttribute("role", "main");
    }

    if (footer && !footer.hasAttribute("role")) {
      footer.setAttribute("role", "contentinfo");
    }

    if (nav && !nav.hasAttribute("role")) {
      nav.setAttribute("role", "navigation");
    }
  }

  /**
   * Enhance focus indicators for better visibility
   */
  private static enhanceFocusIndicators(): void {
    const styleId = "enhanced-focus-styles";

    if (document.getElementById(styleId)) return; // Already injected

    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
      /* Enhanced focus indicators for better accessibility */
      a:focus,
      button:focus,
      input:focus,
      select:focus,
      textarea:focus,
      [tabindex]:focus {
        outline: 2px solid var(--color-border-focus, #8b5cf6) !important;
        outline-offset: 2px !important;
        border-radius: 4px !important;
        box-shadow: 
          0 0 0 4px color-mix(in srgb, var(--color-border-focus, #8b5cf6) 20%, transparent) !important;
      }
      
      /* Special handling for elements that already handle focus visuals */
      .focus-visible:ring-[var(--color-border-focus)] {
        outline: none !important;
      }
    `;

    document.head.appendChild(style);
  }

  /**
   * Apply reduced motion enhancements
   */
  private static applyReducedMotion(): void {
    if (!this.prefersReducedMotion()) return;

    const styleId = "reduced-motion-styles";

    if (document.getElementById(styleId)) return; // Already injected

    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
      /* Reduce or eliminate animations for users who prefer reduced motion */
      *,
      ::before,
      ::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
      
      .animate-pulse,
      .animate-spin,
      .animate-bounce,
      .animate-ping {
        animation: none !important;
      }
      
      /* Preserve essential transitions that aid usability */
      .preserve-essential-transitions {
        transition: opacity 0.1s ease, visibility 0.1s ease !important;
      }
    `;

    document.head.appendChild(style);
  }

  /**
   * Apply high contrast styles
   */
  private static applyHighContrast(): void {
    if (!this.prefersHighContrast() && !this.isForcedColors()) return;

    const styleId = "high-contrast-styles";

    if (document.getElementById(styleId)) return; // Already injected

    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
      /* Enhance contrast for users who prefer high contrast */
      .bg-surface-base,
      .bg-surface-card,
      .bg-surface-glass,
      .glass,
      .glass-card,
      .glass-1,
      .glass-2,
      .glass-3,
      .glass-header,
      .glass-panel {
        background-color: ButtonFace !important;
        color:ButtonText !important;
      }
      
      .text-text-primary,
      .text-text-secondary,
      .text-text-tertiary {
        color: CanvasText !important;
      }
      
      .border-line,
      .border-border {
        border-color: CanvasText !important;
      }
      
      .btn,
      .button {
        border: 1px solid CanvasText !important;
        background-color: ButtonFace !important;
        color: ButtonText !important;
      }
      
      /* Ensure sufficient color contrast ratios */
      .insufficient-contrast {
        color: CanvasText !important;
      }
    `;

    document.head.appendChild(style);
  }

  /**
   * Ensure touch targets meet accessibility standards
   */
  private static ensureTouchTargets(): void {
    // This will be handled by the existing touchTargets system
    // Just adding this as a future extension point
  }

  /**
   * Initialize accessibility monitoring
   */
  static initializeAccessibilityMonitoring(): void {
    // Monitor changes to accessibility preferences
    const reducedMotionMedia = window.matchMedia("(prefers-reduced-motion: reduce)");
    const highContrastMedia = window.matchMedia("(prefers-contrast: high)");
    const forcedColorsMedia = window.matchMedia("(forced-colors: active)");
    const colorSchemeMedia = window.matchMedia("(prefers-color-scheme: dark)");

    const updateAccessibilityPreferences = () => {
      // Update document classes based on preferences
      document.documentElement.classList.toggle(
        "prefers-reduced-motion",
        this.prefersReducedMotion(),
      );
      document.documentElement.classList.toggle(
        "prefers-high-contrast",
        this.prefersHighContrast(),
      );
      document.documentElement.classList.toggle("forced-colors", this.isForcedColors());
    };

    // Initial update
    updateAccessibilityPreferences();

    // Listen for preference changes
    reducedMotionMedia.addEventListener("change", updateAccessibilityPreferences);
    highContrastMedia.addEventListener("change", updateAccessibilityPreferences);
    forcedColorsMedia.addEventListener("change", updateAccessibilityPreferences);
    colorSchemeMedia.addEventListener("change", updateAccessibilityPreferences);
  }

  /**
   * Announce a message to screen readers
   */
  static announce(message: string, priority: "polite" | "assertive" = "polite"): void {
    const announcement = document.createElement("div");
    announcement.setAttribute("aria-live", priority);
    announcement.setAttribute("aria-atomic", "true");
    announcement.className = "sr-only";
    announcement.textContent = message;

    document.body.appendChild(announcement);

    // Clean up after announcing
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }

  /**
   * Skip to main content for keyboard users
   */
  static skipToMainContent(targetSelector = 'main, [role="main"]'): void {
    const mainElement = document.querySelector(targetSelector) as HTMLElement;
    if (mainElement) {
      mainElement.focus({ preventScroll: true });
      mainElement.scrollIntoView({ behavior: "auto", block: "start" });
      this.announce("Navigation to main content completed", "polite");
    }
  }
}

// Enhanced Focus Trap Utility
export class FocusTrap {
  private activeElementBeforeTrap: HTMLElement | null = null;
  private focusableElements: HTMLElement[] = [];
  private wrapper: HTMLElement;

  constructor(wrapper: HTMLElement) {
    this.wrapper = wrapper;
  }

  activate(): void {
    this.activeElementBeforeTrap = document.activeElement as HTMLElement;
    this.refreshFocusables();
    this.trap();

    // Add event listeners
    document.addEventListener("keydown", this.handleTabKey.bind(this));
    document.addEventListener("focusin", this.enforceFocus.bind(this));
  }

  deactivate(): void {
    // Remove event listeners
    document.removeEventListener("keydown", this.handleTabKey.bind(this));
    document.removeEventListener("focusin", this.enforceFocus.bind(this));

    // Restore focus to previously active element
    if (this.activeElementBeforeTrap && this.activeElementBeforeTrap.focus) {
      this.activeElementBeforeTrap.focus();
    }
  }

  private refreshFocusables(): void {
    // Query all focusable elements within the wrapper
    this.focusableElements = Array.from(
      this.wrapper.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"]), [role="button"], [role="link"], [role="menuitem"], [role="option"], [role="tab"], [role="checkbox"], [role="radio"], details>summary:first-of-type',
      ),
    ).filter((el) => {
      const style = window.getComputedStyle(el as Element);
      return (
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        !(el as HTMLElement).hasAttribute("disabled") &&
        (el as HTMLElement).offsetWidth > 0 &&
        (el as HTMLElement).offsetHeight > 0
      );
    }) as HTMLElement[];
  }

  private trap(): void {
    if (this.focusableElements.length > 0) {
      const firstElement = this.focusableElements[0];
      if (firstElement) {
        firstElement.focus();
      }
    } else {
      // If no focusable elements, focus the wrapper itself
      this.wrapper.setAttribute("tabindex", "-1");
      this.wrapper.focus();
    }
  }

  private handleTabKey(event: KeyboardEvent): void {
    if (event.key !== "Tab") return;

    if (this.focusableElements.length === 0) return;

    const focusedIndex = this.focusableElements.indexOf(document.activeElement as HTMLElement);

    if (event.shiftKey && focusedIndex === 0) {
      // Shift-tab from first element: go to last
      event.preventDefault();
      const lastElement = this.focusableElements[this.focusableElements.length - 1];
      if (lastElement) {
        lastElement.focus();
      }
    } else if (!event.shiftKey && focusedIndex === this.focusableElements.length - 1) {
      // Tab from last element: go to first
      event.preventDefault();
      const firstElement = this.focusableElements[0];
      if (firstElement) {
        firstElement.focus();
      }
    }
  }

  private enforceFocus(event: FocusEvent): void {
    const target = event.target as HTMLElement;

    // Only enforce focus if the focus is moving outside of the trapped area
    if (!this.wrapper.contains(target) && target !== this.activeElementBeforeTrap) {
      // Return focus to the trapped area
      this.trap();
    }
  }
}

// Initialize accessibility enhancements when DOM is ready
if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      AccessibilityUtils.applyAccessibilityEnhancements();
      AccessibilityUtils.initializeAccessibilityMonitoring();
    });
  } else {
    // Document already loaded
    AccessibilityUtils.applyAccessibilityEnhancements();
    AccessibilityUtils.initializeAccessibilityMonitoring();
  }
}
