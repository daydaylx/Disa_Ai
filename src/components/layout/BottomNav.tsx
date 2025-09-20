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

      if (event.direction === "left" && currentIndex < 3) {
        // Swipe left = next tab
        const tabs = ["#/chat", "#/chats", "#/quickstart", "#/settings"];
        to(tabs[currentIndex + 1]!);
      } else if (event.direction === "right" && currentIndex > 0) {
        // Swipe right = previous tab
        const tabs = ["#/chat", "#/chats", "#/quickstart", "#/settings"];
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
    if (hash.startsWith("#/chats")) return 1;
    if (hash.startsWith("#/quickstart")) return 2;
    if (hash.startsWith("#/settings")) return 3;
    return 0;
  };

  return (
    <nav
      ref={(el) => {
        ref.current = el;
      }}
      className="bottom-nav safe-bottom inset-x-5 bottom-5 fixed z-30"
      role="navigation"
      aria-label="Hauptnavigation"
      data-version={import.meta.env.VITE_APP_VERSION}
    >
      <ul className="grid grid-cols-3 items-center gap-1">
        <li>
          <button
            onClick={() => to("#/chat")}
            className={`nav-tab ${is("#/chat") ? "nav-tab--active" : ""}`}
            aria-current={is("#/chat") ? "page" : undefined}
            aria-label="Chat öffnen"
            data-testid="nav-bottom-chat"
            onTouchStart={() => hapticFeedback.tap()}
          >
            Chat
          </button>
        </li>
        <li>
          <button
            onClick={() => to("#/chats")}
            className={`nav-tab ${is("#/chats") ? "nav-tab--active" : ""}`}
            aria-current={is("#/chats") ? "page" : undefined}
            aria-label="Chat-Verlauf"
            data-testid="nav-bottom-chats"
            onTouchStart={() => hapticFeedback.tap()}
          >
            Verlauf
          </button>
        </li>
        <li>
          <button
            onClick={() => to("#/settings")}
            className={`nav-tab ${is("#/settings") ? "nav-tab--active" : ""}`}
            aria-current={is("#/settings") ? "page" : undefined}
            aria-label="Einstellungen"
            data-testid="nav-bottom-settings"
            onTouchStart={() => hapticFeedback.tap()}
          >
            Einstellungen
          </button>
        </li>
      </ul>
    </nav>
  );
}
