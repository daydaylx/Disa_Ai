/**
 * Touch gesture utilities for mobile UX
 */

export interface TouchGestureOptions {
  swipeThreshold?: number;
  tapTimeout?: number;
  longPressTimeout?: number;
  preventDefaultSwipe?: boolean;
}

export interface SwipeEvent {
  direction: "left" | "right" | "up" | "down";
  deltaX: number;
  deltaY: number;
  duration: number;
}

export interface TapEvent {
  x: number;
  y: number;
  timestamp: number;
}

const DEFAULT_OPTIONS: Required<TouchGestureOptions> = {
  swipeThreshold: 50,
  tapTimeout: 300,
  longPressTimeout: 500,
  preventDefaultSwipe: true,
};

export class TouchGestureHandler {
  private element: HTMLElement;
  private options: Required<TouchGestureOptions>;
  private startTouch: Touch | null = null;
  private startTime = 0;
  private tapTimer: number | null = null;
  private longPressTimer: number | null = null;

  private onSwipe?: (event: SwipeEvent) => void;
  private onTap?: (event: TapEvent) => void;
  private onLongPress?: (event: TapEvent) => void;

  constructor(element: HTMLElement, options: TouchGestureOptions = {}) {
    this.element = element;
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.attachListeners();
  }

  public onSwipeGesture(callback: (event: SwipeEvent) => void) {
    this.onSwipe = callback;
    return this;
  }

  public onTapGesture(callback: (event: TapEvent) => void) {
    this.onTap = callback;
    return this;
  }

  public onLongPressGesture(callback: (event: TapEvent) => void) {
    this.onLongPress = callback;
    return this;
  }

  private attachListeners() {
    this.element.addEventListener("touchstart", this.handleTouchStart, { passive: false });
    this.element.addEventListener("touchmove", this.handleTouchMove, { passive: false });
    this.element.addEventListener("touchend", this.handleTouchEnd, { passive: false });
    this.element.addEventListener("touchcancel", this.handleTouchCancel, { passive: false });
  }

  private handleTouchStart = (event: TouchEvent) => {
    if (event.touches.length !== 1) return;

    this.startTouch = event.touches[0]!;
    this.startTime = Date.now();

    // Clear any existing timers
    this.clearTimers();

    // Set up long press timer
    if (this.onLongPress) {
      this.longPressTimer = window.setTimeout(() => {
        if (this.startTouch && this.onLongPress) {
          this.onLongPress({
            x: this.startTouch.clientX,
            y: this.startTouch.clientY,
            timestamp: this.startTime,
          });
        }
        this.cleanup();
      }, this.options.longPressTimeout);
    }
  };

  private handleTouchMove = (event: TouchEvent) => {
    if (!this.startTouch || event.touches.length !== 1) return;

    const currentTouch = event.touches[0]!;
    const deltaX = currentTouch.clientX - this.startTouch.clientX;
    const deltaY = currentTouch.clientY - this.startTouch.clientY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // Cancel long press if user moves too much
    if (distance > 10) {
      this.clearLongPressTimer();
    }

    // Prevent default if this might be a swipe
    if (this.options.preventDefaultSwipe && distance > this.options.swipeThreshold / 2) {
      event.preventDefault();
    }
  };

  private handleTouchEnd = (event: TouchEvent) => {
    if (!this.startTouch) return;

    const endTouch = event.changedTouches[0]!;
    const deltaX = endTouch.clientX - this.startTouch.clientX;
    const deltaY = endTouch.clientY - this.startTouch.clientY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const duration = Date.now() - this.startTime;

    // Clear timers
    this.clearTimers();

    // Check for swipe
    if (distance >= this.options.swipeThreshold && this.onSwipe) {
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      let direction: SwipeEvent["direction"];
      if (absX > absY) {
        direction = deltaX > 0 ? "right" : "left";
      } else {
        direction = deltaY > 0 ? "down" : "up";
      }

      this.onSwipe({ direction, deltaX, deltaY, duration });
    }
    // Check for tap (not a swipe and not a long press)
    else if (distance < 10 && duration < this.options.tapTimeout && this.onTap) {
      this.onTap({
        x: endTouch.clientX,
        y: endTouch.clientY,
        timestamp: this.startTime,
      });
    }

    this.cleanup();
  };

  private handleTouchCancel = () => {
    this.cleanup();
  };

  private clearTimers() {
    this.clearTapTimer();
    this.clearLongPressTimer();
  }

  private clearTapTimer() {
    if (this.tapTimer) {
      clearTimeout(this.tapTimer);
      this.tapTimer = null;
    }
  }

  private clearLongPressTimer() {
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }
  }

  private cleanup() {
    this.startTouch = null;
    this.startTime = 0;
    this.clearTimers();
  }

  public destroy() {
    this.element.removeEventListener("touchstart", this.handleTouchStart);
    this.element.removeEventListener("touchmove", this.handleTouchMove);
    this.element.removeEventListener("touchend", this.handleTouchEnd);
    this.element.removeEventListener("touchcancel", this.handleTouchCancel);
    this.clearTimers();
  }
}

/**
 * Ensures touch targets meet minimum size requirements (44px recommended)
 */
export function ensureTouchTarget(element: HTMLElement, minSize = 44) {
  const rect = element.getBoundingClientRect();
  const style = element.style;

  if (rect.width < minSize) {
    style.minWidth = `${minSize}px`;
  }

  if (rect.height < minSize) {
    style.minHeight = `${minSize}px`;
  }

  // Ensure the element is tappable
  if (!element.hasAttribute("tabindex") && !element.closest("button, a, input, select, textarea")) {
    element.setAttribute("tabindex", "0");
  }
}

/**
 * Debounced touch event handler to prevent rapid firing
 */
export function debouncedTouch<T extends unknown[]>(
  fn: (...args: T) => void,
  delay = 100,
): (...args: T) => void {
  let timeoutId: number | null = null;

  return (...args: T) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = window.setTimeout(() => {
      fn(...args);
      timeoutId = null;
    }, delay);
  };
}
