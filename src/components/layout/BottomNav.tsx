import * as React from "react";

import { TouchGestureHandler } from "../../lib/touch/gestures";
import { hapticFeedback } from "../../lib/touch/haptics";

function useHash(): string {
  const [h, setH] = React.useState<string>(() =>
    typeof location !== "undefined" ? location.hash || "#/chat" : "#/chat",
  );
  React.useEffect(() => {
    const on = () => setH(location.hash || "#/chat");
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  return h;
}

export default function BottomNav() {
  const h = useHash().toLowerCase();
  const is = (p: string) => h.startsWith(p);
  const to = (p: string) => {
    hapticFeedback.select();
    location.hash = p;
  };

  const ref = React.useRef<HTMLElement | null>(null);
  const gestureHandlerRef = React.useRef<TouchGestureHandler | null>(null);
  // Navigation height tracking
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const setVar = () => {
      const h = el.offsetHeight || 56;
      document.documentElement.style.setProperty("--bottomnav-h", `${h}px`);
    };
    setVar();
    const ro = new ResizeObserver(setVar);
    ro.observe(el);
    return () => {
      ro.disconnect();
      document.documentElement.style.removeProperty("--bottomnav-h");
    };
  }, []);

  // Touch gestures for navigation
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handler = new TouchGestureHandler(el, {
      swipeThreshold: 80,
      preventDefaultSwipe: false,
    });

    gestureHandlerRef.current = handler;

    // Swipe gestures for navigation
    handler.onSwipeGesture((event) => {
      const currentIndex = getCurrentTabIndex(h);
      const tabs = ["#/chat", "#/models", "#/settings"] as const;

      if (event.direction === "left" && currentIndex < tabs.length - 1) {
        // Swipe left = next tab
        to(tabs[currentIndex + 1]!);
      } else if (event.direction === "right" && currentIndex > 0) {
        // Swipe right = previous tab
        to(tabs[currentIndex - 1]!);
      }
    });

    return () => {
      handler.destroy();
      gestureHandlerRef.current = null;
    };
  }, [h]);

  const getCurrentTabIndex = (hash: string): number => {
    if (hash.startsWith("#/chat")) return 0;
    if (hash.startsWith("#/models")) return 1;
    if (hash.startsWith("#/settings")) return 2;
    return 0;
  };

  return (
    <nav
      ref={(el) => {
        ref.current = el;
      }}
      className="glass-nav glass-hardware-accel safe-bottom fixed inset-x-4 bottom-4 z-50 mx-auto max-w-md"
      role="navigation"
      aria-label="Hauptnavigation"
      data-version={import.meta.env.VITE_APP_VERSION}
    >
      <ul className="grid grid-cols-3 items-center gap-2 p-2">
        <li>
          <button
            onClick={() => to("#/chat")}
            className={`glass-nav__tab ${is("#/chat") ? "glass-nav__tab--active" : ""}`}
            aria-current={is("#/chat") ? "page" : undefined}
            aria-label="Chat öffnen"
            data-testid="nav-bottom-chat"
            onTouchStart={() => hapticFeedback.tap()}
          >
            💬 Chat
          </button>
        </li>
        <li>
          <button
            onClick={() => to("#/models")}
            className={`glass-nav__tab ${is("#/models") ? "glass-nav__tab--active" : ""}`}
            aria-current={is("#/models") ? "page" : undefined}
            aria-label="Modelle"
            data-testid="nav-bottom-models"
            onTouchStart={() => hapticFeedback.tap()}
          >
            🤖 Modelle
          </button>
        </li>
        <li>
          <button
            onClick={() => to("#/settings")}
            className={`glass-nav__tab ${is("#/settings") ? "glass-nav__tab--active" : ""}`}
            aria-current={is("#/settings") ? "page" : undefined}
            aria-label="Einstellungen"
            data-testid="nav-bottom-settings"
            onTouchStart={() => hapticFeedback.tap()}
          >
            ⚙️ Settings
          </button>
        </li>
      </ul>
    </nav>
  );
}
