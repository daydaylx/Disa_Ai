/**
 * Erweiterte Swipe-Navigation für mobile Chat-Ansichten
 */

import { TouchGestureHandler } from "../touch/gestures";
import { hapticFeedback } from "../touch/haptics";

export interface SwipeNavigationOptions {
  enableHorizontalSwipe?: boolean;
  enableVerticalSwipe?: boolean;
  swipeThreshold?: number;
  animationDuration?: number;
  dampening?: number;
  enablePreview?: boolean;
}

export interface NavigationAction {
  type: "navigate" | "preview" | "cancel";
  direction: "left" | "right" | "up" | "down";
  target?: string;
  data?: any;
}

const DEFAULT_OPTIONS: Required<SwipeNavigationOptions> = {
  enableHorizontalSwipe: true,
  enableVerticalSwipe: false,
  swipeThreshold: 100,
  animationDuration: 300,
  dampening: 0.3,
  enablePreview: true,
};

/**
 * Swipe-Navigation Manager für Chat-Ansichten
 */
export class SwipeNavigationManager {
  private container: HTMLElement;
  private options: Required<SwipeNavigationOptions>;
  private gestureHandler: TouchGestureHandler | null = null;
  private currentOffset = 0;
  private isAnimating = false;
  private previewElement: HTMLElement | null = null;

  private onNavigate?: (action: NavigationAction) => void;
  private onPreview?: (action: NavigationAction) => void;

  constructor(container: HTMLElement, options: SwipeNavigationOptions = {}) {
    this.container = container;
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.setupContainer();
    this.attachGestureHandler();
  }

  /**
   * Navigation-Handler registrieren
   */
  onNavigationAction(callback: (action: NavigationAction) => void): this {
    this.onNavigate = callback;
    return this;
  }

  /**
   * Preview-Handler registrieren
   */
  onPreviewAction(callback: (action: NavigationAction) => void): this {
    this.onPreview = callback;
    return this;
  }

  private setupContainer(): void {
    this.container.style.overflow = "hidden";
    this.container.style.position = "relative";
    this.container.style.willChange = "transform";
  }

  private attachGestureHandler(): void {
    this.gestureHandler = new TouchGestureHandler(this.container, {
      swipeThreshold: this.options.swipeThreshold,
      preventDefaultSwipe: true,
    });

    // Swipe-Gesten
    this.gestureHandler.onSwipeGesture((event) => {
      this.handleSwipe(event.direction, event.deltaX, event.deltaY);
    });

    // Touch-Start für Preview
    this.container.addEventListener("touchstart", this.handleTouchStart, { passive: false });
    this.container.addEventListener("touchmove", this.handleTouchMove, { passive: false });
    this.container.addEventListener("touchend", this.handleTouchEnd, { passive: false });
  }

  private handleTouchStart = (event: TouchEvent) => {
    if (!this.options.enablePreview || this.isAnimating) return;

    const touch = event.touches[0];
    if (!touch) return;

    this.currentOffset = 0;
    this.container.style.transition = "none";
  };

  private handleTouchMove = (event: TouchEvent) => {
    if (!this.options.enablePreview || this.isAnimating) return;

    const touch = event.touches[0];
    if (!touch) return;

    const startTouch = event.changedTouches[0];
    if (!startTouch) return;

    const deltaX = touch.clientX - startTouch.clientX;
    const deltaY = touch.clientY - startTouch.clientY;

    // Horizontale Swipe-Preview
    if (this.options.enableHorizontalSwipe && Math.abs(deltaX) > Math.abs(deltaY)) {
      event.preventDefault();

      const dampedOffset = deltaX * this.options.dampening;
      this.currentOffset = Math.max(-200, Math.min(200, dampedOffset));

      this.container.style.transform = `translateX(${this.currentOffset}px)`;

      // Preview-Feedback
      if (Math.abs(this.currentOffset) > 50) {
        this.showNavigationPreview(deltaX > 0 ? "right" : "left");
      } else {
        this.hideNavigationPreview();
      }
    }

    // Vertikale Swipe-Preview
    if (this.options.enableVerticalSwipe && Math.abs(deltaY) > Math.abs(deltaX)) {
      event.preventDefault();

      const dampedOffset = deltaY * this.options.dampening;
      this.currentOffset = Math.max(-200, Math.min(200, dampedOffset));

      this.container.style.transform = `translateY(${this.currentOffset}px)`;

      if (Math.abs(this.currentOffset) > 50) {
        this.showNavigationPreview(deltaY > 0 ? "down" : "up");
      }
    }
  };

  private handleTouchEnd = () => {
    if (!this.options.enablePreview || this.isAnimating) return;

    this.container.style.transition = `transform ${this.options.animationDuration}ms ease-out`;
    this.container.style.transform = "translate(0, 0)";

    this.hideNavigationPreview();
    this.currentOffset = 0;
  };

  private handleSwipe(
    direction: "left" | "right" | "up" | "down",
    deltaX: number,
    deltaY: number,
  ): void {
    if (this.isAnimating) return;

    // Horizontale Navigation
    if ((direction === "left" || direction === "right") && this.options.enableHorizontalSwipe) {
      hapticFeedback.impact("medium");
      this.executeNavigation(direction, { deltaX, deltaY });
    }

    // Vertikale Navigation
    if ((direction === "up" || direction === "down") && this.options.enableVerticalSwipe) {
      hapticFeedback.impact("medium");
      this.executeNavigation(direction, { deltaX, deltaY });
    }
  }

  private showNavigationPreview(direction: "left" | "right" | "up" | "down"): void {
    if (this.previewElement) return;

    hapticFeedback.select();

    this.previewElement = document.createElement("div");
    this.previewElement.className = "swipe-navigation-preview";
    this.previewElement.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: var(--space-sm) var(--space-md);
      border-radius: var(--radius-button);
      font-size: var(--font-size-body-small);
      font-weight: 500;
      backdrop-filter: blur(10px);
      z-index: 1000;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.2s ease-in-out;
    `;

    const previewText = this.getPreviewText(direction);
    this.previewElement.textContent = previewText;

    document.body.appendChild(this.previewElement);

    // Fade in
    requestAnimationFrame(() => {
      if (this.previewElement) {
        this.previewElement.style.opacity = "1";
      }
    });

    // Preview-Action auslösen
    if (this.onPreview) {
      this.onPreview({
        type: "preview",
        direction,
        target: this.getNavigationTarget(direction),
      });
    }
  }

  private hideNavigationPreview(): void {
    if (!this.previewElement) return;

    this.previewElement.style.opacity = "0";

    setTimeout(() => {
      if (this.previewElement) {
        document.body.removeChild(this.previewElement);
        this.previewElement = null;
      }
    }, 200);
  }

  private executeNavigation(direction: "left" | "right" | "up" | "down", data: any): void {
    this.isAnimating = true;

    // Navigation-Animation
    this.container.style.transition = `transform ${this.options.animationDuration}ms ease-in-out`;

    const translateValue =
      direction === "left" || direction === "right"
        ? `translateX(${direction === "left" ? "-100%" : "100%"})`
        : `translateY(${direction === "up" ? "-100%" : "100%"})`;

    this.container.style.transform = translateValue;

    // Navigation-Action auslösen
    if (this.onNavigate) {
      this.onNavigate({
        type: "navigate",
        direction,
        target: this.getNavigationTarget(direction),
        data,
      });
    }

    // Animation cleanup
    setTimeout(() => {
      this.container.style.transition = "none";
      this.container.style.transform = "translate(0, 0)";
      this.isAnimating = false;
    }, this.options.animationDuration);
  }

  private getPreviewText(direction: "left" | "right" | "up" | "down"): string {
    switch (direction) {
      case "left":
        return "← Zurück";
      case "right":
        return "Weiter →";
      case "up":
        return "↑ Scrollen";
      case "down":
        return "↓ Menü";
      default:
        return "";
    }
  }

  private getNavigationTarget(direction: "left" | "right" | "up" | "down"): string {
    switch (direction) {
      case "left":
        return "back";
      case "right":
        return "forward";
      case "up":
        return "scroll-top";
      case "down":
        return "menu";
      default:
        return "";
    }
  }

  /**
   * Navigation programmatisch auslösen
   */
  navigate(direction: "left" | "right" | "up" | "down"): void {
    this.executeNavigation(direction, { programmatic: true });
  }

  /**
   * Cleanup
   */
  destroy(): void {
    if (this.gestureHandler) {
      this.gestureHandler.destroy();
      this.gestureHandler = null;
    }

    this.container.removeEventListener("touchstart", this.handleTouchStart);
    this.container.removeEventListener("touchmove", this.handleTouchMove);
    this.container.removeEventListener("touchend", this.handleTouchEnd);

    this.hideNavigationPreview();

    // Container-Styles zurücksetzen
    this.container.style.overflow = "";
    this.container.style.position = "";
    this.container.style.willChange = "";
    this.container.style.transition = "";
    this.container.style.transform = "";
  }
}

/**
 * React Hook für Swipe-Navigation
 */
export function useSwipeNavigation(
  _containerRef: { current: HTMLElement | null },
  _options: SwipeNavigationOptions = {},
): SwipeNavigationManager | null {
  // React Hook-Implementierung würde hier hin
  return null;
}

/**
 * Chat-spezifische Navigation-Actions
 */
export const chatNavigationActions = {
  back: () => {
    // Zurück zur Chat-Liste oder vorherige Ansicht
    window.history.back();
  },

  forward: () => {
    // Nächster Chat oder Weiter-Navigation
    // Implementierung abhängig von der Chat-Logik
  },

  scrollToTop: () => {
    // Zum Anfang des Chats scrollen
    window.scrollTo({ top: 0, behavior: "smooth" });
  },

  openMenu: () => {
    // Chat-Menü oder Optionen öffnen
    const settingsButton = document.querySelector('[data-testid="settings-button"]') as HTMLElement;
    settingsButton?.click();
  },
};
