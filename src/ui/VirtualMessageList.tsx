import React, { useEffect, useMemo, useRef, useState } from "react";

import { Button } from "../components/ui/button";
import type { Message } from "./types";

export default function VirtualMessageList({
  items,
  renderItem,
  className = "",
  onSuggestionClick,
}: {
  items: Message[];
  renderItem: (m: Message) => React.ReactNode;
  className?: string;
  onSuggestionClick?: (suggestion: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(120);
  const [showScrollAnchor, setShowScrollAnchor] = useState(false);
  const [isNearBottom, setIsNearBottom] = useState(true);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !isNearBottom) return;

    const timer = setTimeout(() => {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }, 10);

    return () => clearTimeout(timer);
  }, [items.length, isNearBottom]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const { scrollTop, scrollHeight, clientHeight } = el;
          const nearBottom = scrollHeight - scrollTop - clientHeight < 100;
          setIsNearBottom(nearBottom);
          setShowScrollAnchor(!nearBottom && scrollTop > 200);
          ticking = false;
        });
        ticking = true;
      }
    };

    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  const total = items.length;
  const start = Math.max(0, total - visibleCount);
  const slice = useMemo(() => items.slice(start, total), [items, start, total]);

  const loadOlder = () => {
    setVisibleCount((n) => Math.min(total, n + 120));
    requestAnimationFrame(() => {
      const el = containerRef.current;
      if (!el) return;
      el.scrollTo({ top: 0 });
    });
  };

  const scrollToBottom = () => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className={`safe-bottom h-full flex-1 overflow-y-auto ${className}`}
        aria-label="Chat messages"
        role="log"
      >
        {start > 0 && (
          <div className="sticky top-0 z-10 flex justify-center">
            <Button variant="outline" size="sm" onClick={loadOlder} className="my-1">
              Ältere Nachrichten laden ({start})
            </Button>
          </div>
        )}
        {slice.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center px-4 py-12"
            style={{ minHeight: "calc(var(--vh, 100dvh) * 0.6)" }}
          >
            <div className="max-w-lg space-y-8 text-center">
              <div className="space-y-6">
                <div className="relative mx-auto h-24 w-24">
                  <div className="border-border bg-surface-1 flex h-full w-full items-center justify-center rounded-full border-2">
                    <svg width="32" height="32" viewBox="0 0 24 24" className="text-text-1">
                      <path
                        fill="currentColor"
                        d="M12 3c5.5 0 10 3.58 10 8s-4.5 8-10 8c-1.24 0-2.43-.18-3.53-.5C5.55 21 2 21 2 21c2.33-2.33 2.7-3.9 2.75-4.5C3.05 15.07 2 13.13 2 11c0-4.42 4.5-8 10-8Z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="space-y-3">
                  <h2 className="text-text-0 text-3xl font-bold tracking-tight">Disa AI</h2>
                  <p className="text-text-1 text-lg font-medium">
                    Starte eine Unterhaltung mit deinem KI-Assistenten
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-text-0 text-xl font-semibold">Was möchtest du besprechen?</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    {
                      text: "Erkläre mir ein komplexes Thema",
                      icon: "💡",
                    },
                    {
                      text: "Hilf mir beim Programmieren",
                      icon: "⚡",
                    },
                    {
                      text: "Lass uns kreativ schreiben",
                      icon: "✨",
                    },
                    {
                      text: "Löse ein Problem mit mir",
                      icon: "🔧",
                    },
                  ].map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => onSuggestionClick?.(suggestion.text)}
                      className="border-border bg-surface-1 text-text-0 hover:bg-surface-2 rounded-lg border p-4 transition-colors"
                    >
                      <div className="flex items-center gap-3 text-left">
                        <span className="text-lg">{suggestion.icon}</span>
                        <span className="text-sm font-medium leading-tight">{suggestion.text}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          slice.map((m) => <div key={m.id}>{renderItem(m)}</div>)
        )}
      </div>
      {showScrollAnchor && (
        <Button
          size="icon"
          onClick={scrollToBottom}
          className="fixed z-20"
          style={{
            bottom: `calc(var(--bottom-nav-h) + 24px + max(16px, var(--safe-bottom)))`,
            right: `max(16px, var(--safe-right))`,
          }}
          aria-label="Zum Ende scrollen"
        >
          ↓
        </Button>
      )}
    </div>
  );
}
