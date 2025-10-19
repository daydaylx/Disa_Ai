import { Menu, X } from "lucide-react";
import type { ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";

import { TouchGestureHandler } from "../../lib/touch/gestures";
import { cn } from "../../lib/utils";

interface NavigationItem {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavigationSidepanelProps {
  items: NavigationItem[];
  children?: ReactNode;
  className?: string;
}

interface SidepanelState {
  isOpen: boolean;
  isAnimating: boolean;
  dragOffset: number;
}

const PANEL_WIDTH = 280;
const SWIPE_THRESHOLD = 50;
const SWIPE_VELOCITY_THRESHOLD = 0.5;

export function NavigationSidepanel({ items, children, className }: NavigationSidepanelProps) {
  const [state, setState] = useState<SidepanelState>({
    isOpen: false,
    isAnimating: false,
    dragOffset: 0,
  });

  const panelRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const gestureHandlerRef = useRef<TouchGestureHandler | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Open/Close functions
  const openPanel = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: true, isAnimating: true }));
    setTimeout(() => setState((prev) => ({ ...prev, isAnimating: false })), 300);
  }, []);

  const closePanel = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: false, isAnimating: true, dragOffset: 0 }));
    setTimeout(() => setState((prev) => ({ ...prev, isAnimating: false })), 300);
  }, []);

  const togglePanel = useCallback(() => {
    if (state.isOpen) {
      closePanel();
    } else {
      openPanel();
    }
  }, [state.isOpen, openPanel, closePanel]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && state.isOpen) {
        closePanel();
      }

      if (event.key === "Tab" && state.isOpen && panelRef.current) {
        const focusableElements = panelRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [state.isOpen, closePanel]);

  // Focus management
  useEffect(() => {
    if (state.isOpen) {
      // Focus the close button when panel opens
      setTimeout(() => closeButtonRef.current?.focus(), 100);
    } else {
      // Return focus to menu button when panel closes
      menuButtonRef.current?.focus();
    }
  }, [state.isOpen]);

  // Touch gesture setup
  useEffect(() => {
    if (!overlayRef.current) return;

    const gestureHandler = new TouchGestureHandler(overlayRef.current, {
      swipeThreshold: SWIPE_THRESHOLD,
      preventDefaultSwipe: false,
    });

    let isDragging = false;
    let startX = 0;
    let currentX = 0;
    let startTime = 0;

    gestureHandler.onSwipeGesture((swipeEvent) => {
      if (swipeEvent.direction === "left" && state.isOpen) {
        closePanel();
      } else if (swipeEvent.direction === "right" && !state.isOpen) {
        // Only allow opening from right edge (last 50px)
        const screenWidth = window.innerWidth;
        if (startX > screenWidth - 50) {
          openPanel();
        }
      }
    });

    // Custom drag handling for smooth panel movement
    const handleTouchStart = (event: TouchEvent) => {
      if (event.touches.length !== 1) return;

      startX = event.touches[0]!.clientX;
      currentX = startX;
      startTime = Date.now();
      isDragging = false;

      // Only allow drag from right edge when closed, or anywhere when open
      const screenWidth = window.innerWidth;
      if (!state.isOpen && startX < screenWidth - 50) return;

      isDragging = true;
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (!isDragging || event.touches.length !== 1) return;

      currentX = event.touches[0]!.clientX;
      const deltaX = currentX - startX;

      if (state.isOpen) {
        // When open, allow dragging left to close
        const offset = Math.min(0, deltaX);
        setState((prev) => ({ ...prev, dragOffset: offset }));
      } else {
        // When closed, allow dragging right to open
        const offset = Math.max(0, deltaX);
        setState((prev) => ({ ...prev, dragOffset: offset }));
      }
    };

    const handleTouchEnd = () => {
      if (!isDragging) return;

      const deltaX = currentX - startX;
      const duration = Date.now() - startTime;
      const velocity = Math.abs(deltaX) / duration;

      // Determine if we should complete the gesture
      const shouldToggle =
        Math.abs(deltaX) > PANEL_WIDTH / 3 || velocity > SWIPE_VELOCITY_THRESHOLD;

      if (state.isOpen && deltaX < -SWIPE_THRESHOLD && shouldToggle) {
        closePanel();
      } else if (!state.isOpen && deltaX > SWIPE_THRESHOLD && shouldToggle) {
        openPanel();
      } else {
        // Snap back
        setState((prev) => ({ ...prev, dragOffset: 0 }));
      }

      isDragging = false;
    };

    const currentOverlay = overlayRef.current;
    currentOverlay.addEventListener("touchstart", handleTouchStart, { passive: true });
    currentOverlay.addEventListener("touchmove", handleTouchMove, { passive: true });
    currentOverlay.addEventListener("touchend", handleTouchEnd, { passive: true });

    gestureHandlerRef.current = gestureHandler;

    return () => {
      gestureHandler.destroy();
      if (currentOverlay) {
        currentOverlay.removeEventListener("touchstart", handleTouchStart);
        currentOverlay.removeEventListener("touchmove", handleTouchMove);
        currentOverlay.removeEventListener("touchend", handleTouchEnd);
      }
    };
  }, [state.isOpen, openPanel, closePanel]);

  // Calculate transform based on state
  const getTransform = () => {
    if (state.isAnimating) {
      return state.isOpen ? "translateX(0)" : `translateX(${PANEL_WIDTH}px)`;
    }

    if (state.isOpen) {
      return `translateX(${state.dragOffset}px)`;
    } else {
      return `translateX(${PANEL_WIDTH + Math.min(0, state.dragOffset)}px)`;
    }
  };

  const getOverlayOpacity = () => {
    if (state.isAnimating) {
      return state.isOpen ? 1 : 0;
    }

    if (state.isOpen) {
      return Math.max(0, 1 + state.dragOffset / PANEL_WIDTH);
    } else {
      return Math.max(0, Math.min(1, state.dragOffset / PANEL_WIDTH));
    }
  };

  return (
    <>
      {/* Menu Button */}
      <button
        ref={menuButtonRef}
        onClick={togglePanel}
        className={cn(
          "fixed z-50 flex h-12 w-12 items-center justify-center rounded-full",
          "glass glass--subtle border-border/60 border backdrop-blur-md transition-all duration-200",
          "text-text-0 hover:text-brand hover:border-brand/50 hover:shadow-neon",
          "touch-target haptic-feedback sidepanel-focus-visible",
          className,
        )}
        style={{
          top: "calc(env(safe-area-inset-top, 0px) + 1rem)",
          right: "calc(env(safe-area-inset-right, 0px) + 1rem)",
        }}
        aria-label={state.isOpen ? "Navigation schließen" : "Navigation öffnen"}
        aria-expanded={state.isOpen}
        aria-controls="navigation-sidepanel"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Overlay */}
      <div
        ref={overlayRef}
        className={cn(
          "sidepanel-overlay-transition sidepanel-no-select fixed inset-0 z-40",
          state.isOpen || state.dragOffset > 0 ? "pointer-events-auto" : "pointer-events-none",
        )}
        style={{
          backgroundColor: `rgba(0, 0, 0, ${0.5 * getOverlayOpacity()})`,
          backdropFilter: getOverlayOpacity() > 0 ? "blur(4px)" : "none",
        }}
        onClick={closePanel}
        aria-hidden="true"
      />

      {/* Sidepanel */}
      <aside
        ref={panelRef}
        id="navigation-sidepanel"
        className={cn(
          "fixed right-0 top-0 z-50 flex h-full flex-col",
          "glass glass--strong border-border/80 border-l backdrop-blur-xl",
          "sidepanel-container sidepanel-safe-area sidepanel-border",
          state.isAnimating ? "sidepanel-transition" : "transition-none",
        )}
        style={{
          width: `${PANEL_WIDTH}px`,
          transform: getTransform(),
        }}
        aria-label="Hauptnavigation"
        role="navigation"
      >
        {/* Header */}
        <div className="border-border/60 flex items-center justify-between border-b p-4">
          <h2 className="text-text-0 text-lg font-semibold">Navigation</h2>
          <button
            ref={closeButtonRef}
            onClick={closePanel}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-full",
              "text-text-1 hover:text-text-0 hover:bg-hover-bg",
              "touch-target transition-colors duration-200",
            )}
            aria-label="Navigation schließen"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="sidepanel-scroll flex-1 overflow-y-auto p-4">
          <ul className="space-y-2" role="list">
            {items.map(({ to, label, icon: Icon }) => (
              <li key={to} role="listitem">
                <NavLink to={to} onClick={closePanel}>
                  {({ isActive }) => (
                    <div
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200",
                        "touch-target no-select sidepanel-focus-visible group",
                        isActive
                          ? "text-brand bg-brand/10 border-brand/20 border shadow-sm"
                          : "text-text-1 hover:text-text-0 hover:bg-hover-bg hover:shadow-sm",
                      )}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <Icon
                        className={cn(
                          "h-5 w-5 flex-shrink-0 transition-colors duration-200",
                          "group-hover:scale-110",
                        )}
                        aria-hidden="true"
                      />
                      <span>{label}</span>
                    </div>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer content */}
        {children && <div className="border-border/60 border-t p-4">{children}</div>}
      </aside>
    </>
  );
}
