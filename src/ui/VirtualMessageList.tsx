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
  const [isNearBottom, setIsNearBottom] = useState(true);

  useEffect(() => {
    // Auto-Scroll bei neuen Messages nur wenn der Nutzer bereits am Ende war
    const el = containerRef.current;
    if (!el || !isNearBottom) return;

    // Kurze Verzögerung für DOM-Updates
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
        className={`safe-pb h-full flex-1 overflow-y-auto ${className}`}
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
          <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-12">
            <div className="max-w-lg space-y-8 text-center">
              {/* Enhanced Hero with dramatic colors */}
              <div className="space-y-6">
                <div className="relative mx-auto h-32 w-32">
                  <div className="absolute inset-0 animate-spin-slow rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 p-1">
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-900">
                      <div className="h-20 w-20 animate-pulse rounded-full border-4 border-white/20 bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 shadow-xl"></div>
                    </div>
                  </div>
                  <div className="absolute -right-2 -top-2 h-8 w-8 animate-bounce rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 shadow-lg"></div>
                  <div className="absolute -bottom-2 -left-2 h-6 w-6 animate-ping rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 shadow-lg"></div>
                </div>
                <div className="space-y-4">
                  <h2 className="animate-pulse bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-4xl font-bold tracking-tight text-transparent">
                    Disa AI
                  </h2>
                  <p className="text-xl font-medium leading-relaxed text-pink-200 drop-shadow-sm">
                    🚀 Starte eine Unterhaltung mit deinem KI-Assistenten
                  </p>
                </div>
              </div>

              {/* Enhanced Quick Start Suggestions */}
              <div className="space-y-4">
                <h3 className="text-text-primary text-xl font-semibold">
                  Was möchtest du besprechen?
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    {
                      text: "🎯 Erkläre mir ein komplexes Thema",
                      color: "from-blue-500 to-cyan-500",
                      icon: "💡",
                    },
                    {
                      text: "💻 Hilf mir beim Programmieren",
                      color: "from-green-500 to-emerald-500",
                      icon: "⚡",
                    },
                    {
                      text: "✨ Lass uns kreativ schreiben",
                      color: "from-purple-500 to-pink-500",
                      icon: "🌟",
                    },
                    {
                      text: "🔧 Löse ein Problem mit mir",
                      color: "from-orange-500 to-red-500",
                      icon: "🚀",
                    },
                  ].map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() =>
                        onSuggestionClick?.(suggestion.text.replace(/[🎯💻✨🔧]\s*/u, ""))
                      }
                      className={`bg-gradient-to-r ${suggestion.color} group relative overflow-hidden rounded-2xl border-2 border-white/20 p-5 font-semibold text-white shadow-xl transition-all duration-300 hover:rotate-1 hover:scale-105 hover:shadow-2xl`}
                    >
                      <div className="absolute inset-0 bg-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                      <div className="relative flex items-center gap-3">
                        <span className="animate-bounce text-2xl transition-transform duration-200 group-hover:scale-125">
                          {suggestion.icon}
                        </span>
                        <span className="text-left text-sm font-bold leading-tight drop-shadow-lg">
                          {suggestion.text}
                        </span>
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
        <button
          onClick={scrollToBottom}
          className="focus-visible:ring-accent-teal/50 bg-primary/80 fixed z-20 rounded-full p-2 text-white shadow-lg hover:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
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
