/**
 * Chat-Container mit Swipe-Navigation und Mobile-Features
 */

import * as React from "react";
import { useEffect, useRef, useState } from "react";

import { SwipeNavigationManager } from "../../lib/navigation/swipeNavigation";
import { mobileToast } from "../../lib/toast/mobileToast";
import { cn } from "../../lib/utils/cn";

export interface ChatContainerProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  className?: string;
  enableSwipeNavigation?: boolean;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  className,
  enableSwipeNavigation = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const swipeManagerRef = useRef<SwipeNavigationManager | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);

  // Swipe Navigation initialisieren
  useEffect(() => {
    if (!enableSwipeNavigation || !containerRef.current) return;

    const manager = new SwipeNavigationManager(containerRef.current, {
      enableHorizontalSwipe: true,
      enableVerticalSwipe: true,
      swipeThreshold: 120,
      animationDuration: 300,
      enablePreview: true,
    });

    swipeManagerRef.current = manager;

    // Navigation Handler
    manager.onNavigationAction((action) => {
      setIsNavigating(true);

      switch (action.direction) {
        case "left":
          if (onSwipeLeft) {
            onSwipeLeft();
          } else {
            // Standard: Zurück zur Chat-Liste
            window.history.back();
            mobileToast.info("Zurück zur Chat-Liste", {
              duration: 1500,
              position: "center",
            });
          }
          break;

        case "right":
          if (onSwipeRight) {
            onSwipeRight();
          } else {
            // Standard: Nächster Chat oder Forward
            mobileToast.info("Keine weiteren Chats", {
              duration: 1500,
              position: "center",
            });
          }
          break;

        case "up":
          if (onSwipeUp) {
            onSwipeUp();
          } else {
            // Standard: Zum Anfang scrollen
            window.scrollTo({ top: 0, behavior: "smooth" });
            mobileToast.info("Zum Anfang gescrollt", {
              duration: 1000,
              position: "center",
            });
          }
          break;

        case "down":
          if (onSwipeDown) {
            onSwipeDown();
          } else {
            // Standard: Einstellungen öffnen
            const settingsButton = document.querySelector(
              '[data-testid="nav-bottom-settings"]',
            ) as HTMLElement;
            if (settingsButton) {
              settingsButton.click();
              mobileToast.info("Einstellungen geöffnet", {
                duration: 1500,
                position: "center",
              });
            }
          }
          break;
      }

      // Navigation abgeschlossen
      setTimeout(() => {
        setIsNavigating(false);
      }, 400);
    });

    // Preview Handler
    manager.onPreviewAction((action) => {
      // Preview-Feedback über das bestehende Toast-System
      const previewText = getPreviewText(action.direction);
      if (previewText) {
        mobileToast.info(previewText, {
          duration: 800,
          position: "center",
          haptic: false, // Kein Haptic während Preview
        });
      }
    });

    return () => {
      manager.destroy();
      swipeManagerRef.current = null;
    };
  }, [
    enableSwipeNavigation,
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
  ]);

  const getPreviewText = (direction: "left" | "right" | "up" | "down"): string => {
    switch (direction) {
      case "left":
        return "← Zurück zur Liste";
      case "right":
        return "Nächster Chat →";
      case "up":
        return "↑ Nach oben";
      case "down":
        return "↓ Einstellungen";
      default:
        return "";
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "chat-container relative h-full w-full overflow-hidden",
        isNavigating && "pointer-events-none",
        className,
      )}
      data-swipe-navigation={enableSwipeNavigation}
    >
      {children}

      {/* Navigation Overlay bei aktiver Navigation */}
      {isNavigating && (
        <div className="absolute inset-0 z-50 bg-black/10 backdrop-blur-sm" />
      )}
    </div>
  );
};

/**
 * Hook für Chat-Container mit Swipe-Navigation
 */
export function useChatContainer(options: {
  enableSwipeNavigation?: boolean;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
} = {}) {
  const [isNavigating, setIsNavigating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const navigateToChat = (direction: "prev" | "next") => {
    setIsNavigating(true);

    // Simuliere Chat-Navigation
    const action = direction === "prev" ? "Vorheriger Chat" : "Nächster Chat";
    mobileToast.info(action, {
      duration: 1500,
      position: "center",
    });

    setTimeout(() => setIsNavigating(false), 300);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    mobileToast.success("Nach oben gescrollt", {
      duration: 1000,
      position: "center",
    });
  };

  const openSettings = () => {
    window.location.hash = "#/settings";
    mobileToast.info("Einstellungen geöffnet", {
      duration: 1500,
      position: "center",
    });
  };

  return {
    containerRef,
    isNavigating,
    navigateToChat,
    scrollToTop,
    openSettings,
    ...options,
  };
}

/**
 * Chat-Layout mit integrierter Navigation
 */
export interface ChatLayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  composer?: React.ReactNode;
  className?: string;
  enableSwipeNavigation?: boolean;
}

export const ChatLayout: React.FC<ChatLayoutProps> = ({
  children,
  header,
  composer,
  className,
  enableSwipeNavigation = true,
}) => {
  return (
    <div className={cn("flex h-full flex-col", className)}>
      {/* Header */}
      {header && (
        <div className="flex-shrink-0 border-b border-white/10 bg-white/5 backdrop-blur-sm">
          {header}
        </div>
      )}

      {/* Chat Content mit Swipe-Navigation */}
      <div className="flex-1 overflow-hidden">
        <ChatContainer enableSwipeNavigation={enableSwipeNavigation}>
          {children}
        </ChatContainer>
      </div>

      {/* Composer */}
      {composer && <div className="flex-shrink-0">{composer}</div>}
    </div>
  );
};