import React, { useEffect, useMemo, useRef, useState } from "react";

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

  useEffect(() => {
    // Auto-Scroll bei neuen Messages
    const el = containerRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [items.length]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollAnchor(!isNearBottom && scrollTop > 200);
    };

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  const total = items.length;
  const start = Math.max(0, total - visibleCount);
  const slice = useMemo(() => items.slice(start, total), [items, start, total]);

  const loadOlder = () => {
    setVisibleCount((n) => Math.min(total, n + 120));
    // kleine Verzögerung, dann oberhalb positionieren
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
        className={`h-full flex-1 overflow-y-auto ${className}`}
        aria-label="Chat messages"
        role="log"
      >
        {start > 0 && (
          <div className="sticky top-0 z-10 flex justify-center">
            <button
              onClick={loadOlder}
              className="my-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs hover:bg-white/10"
            >
              Ältere Nachrichten laden ({start})
            </button>
          </div>
        )}
        {slice.length === 0 ? (
          <div className="flex min-h-[50vh] flex-col items-center justify-center px-4">
            <div className="max-w-md space-y-6 text-center">
              {/* Simplified Hero */}
              <div className="space-y-4">
                <div className="from-accent-teal/20 to-accent-violet/20 border-accent-teal/30 mx-auto flex h-20 w-20 items-center justify-center rounded-full border bg-gradient-to-br">
                  <div className="from-accent-teal to-accent-violet h-8 w-8 rounded-full bg-gradient-to-br"></div>
                </div>
                <div>
                  <h2 className="mb-2 text-2xl font-bold text-text-primary">Disa AI</h2>
                  <p className="text-text-secondary">
                    Starte eine Unterhaltung mit deinem KI-Assistenten
                  </p>
                </div>
              </div>

              {/* Quick Start Suggestions */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-text-primary">
                  Was möchtest du besprechen?
                </h3>
                <div className="space-y-2">
                  {[
                    "Erkläre mir ein komplexes Thema",
                    "Hilf mir beim Programmieren",
                    "Lass uns kreativ schreiben",
                    "Löse ein Problem mit mir",
                  ].map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => onSuggestionClick?.(suggestion)}
                      className="border-glass-border/30 bg-glass-surface/5 hover:bg-glass-surface/10 hover:border-accent-teal/40 focus:ring-accent-teal/50 w-full rounded-lg border p-4 text-left transition-colors focus:outline-none focus:ring-2"
                    >
                      <span className="text-sm font-medium text-text-secondary hover:text-text-primary">
                        {suggestion}
                      </span>
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
        <button
          onClick={scrollToBottom}
          className="bg-primary/80 hover:bg-primary focus-visible:ring-accent-teal/50 fixed z-20 rounded-full p-2 text-white shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
          style={{
            bottom: `calc(var(--bottom-nav-h) + 24px + max(16px, var(--safe-bottom)))`,
            right: `max(16px, var(--safe-right))`,
          }}
          aria-label="Zum Ende scrollen"
        >
          ↓
        </button>
      )}
    </div>
  );
}
