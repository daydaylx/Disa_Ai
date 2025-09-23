import React, { useEffect, useMemo, useRef, useState } from "react";

import type { Message } from "./types";

export default function VirtualMessageList({
  items,
  renderItem,
}: {
  items: Message[];
  renderItem: (m: Message) => React.ReactNode;
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
        className="flex-1 space-y-3 overflow-y-auto px-3 pb-2 pt-3"
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
          <div className="mt-8 px-4">
            <div className="space-y-8">
              {/* Main Hero Card */}
              <div className="card-elev2 flex items-center gap-6">
                <div
                  aria-hidden
                  className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-accent-teal/30 bg-glass-surface/10 backdrop-blur-sm"
                >
                  <div className="h-6 w-6 animate-pulse rounded-full bg-gradient-to-br from-accent-teal/80 to-accent-violet/60 shadow-lg"></div>
                </div>
                <div className="flex-1 space-y-3">
                  <p className="text-sm font-medium tracking-wide text-text-secondary/90">
                    AI Assistant
                  </p>
                  <h2 className="text-xl font-semibold tracking-tight">Disa AI</h2>
                  <p className="text-sm text-text-muted/85">
                    Professional AI-powered conversation partner
                  </p>
                  <div className="text-sm font-medium text-accent-teal/80">
                    Start typing below to begin a conversation
                  </div>
                </div>
              </div>

              {/* Quick Start Suggestions */}
              <div className="glass-card p-6">
                <h3 className="mb-4 text-base font-semibold text-text-primary">
                  Quick Start Ideas
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    "Explain complex topics",
                    "Help with coding",
                    "Creative writing",
                    "Problem solving",
                  ].map((suggestion, index) => (
                    <div
                      key={index}
                      className="group flex cursor-pointer items-center gap-3 rounded-xl border border-glass-border/30 bg-glass-surface/10 p-4 text-left transition-all hover:scale-[1.02] hover:border-accent-teal/40 hover:bg-glass-surface/20"
                    >
                      <div className="h-2 w-2 rounded-full bg-accent-teal/60 group-hover:bg-accent-teal"></div>
                      <span className="text-sm font-medium text-text-secondary group-hover:text-text-primary">
                        {suggestion}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features Overview */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="glass-card p-4 text-center">
                  <div className="mx-auto mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent-teal/20 to-accent-violet/20">
                    <div className="h-3 w-3 rounded bg-accent-teal/80"></div>
                  </div>
                  <h4 className="mb-2 text-sm font-semibold text-text-primary">Smart Responses</h4>
                  <p className="text-xs text-text-muted/80">Contextual and accurate answers</p>
                </div>

                <div className="glass-card p-4 text-center">
                  <div className="mx-auto mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent-violet/20 to-accent-teal/20">
                    <div className="h-3 w-3 rounded bg-accent-violet/80"></div>
                  </div>
                  <h4 className="mb-2 text-sm font-semibold text-text-primary">Multiple Styles</h4>
                  <p className="text-xs text-text-muted/80">Adapt tone and approach</p>
                </div>

                <div className="glass-card p-4 text-center">
                  <div className="mx-auto mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent-teal/20 to-accent-violet/20">
                    <div className="h-3 w-3 rounded bg-gradient-to-r from-accent-teal/80 to-accent-violet/80"></div>
                  </div>
                  <h4 className="mb-2 text-sm font-semibold text-text-primary">Offline Ready</h4>
                  <p className="text-xs text-text-muted/80">Works without internet</p>
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
          className="fixed bottom-20 right-4 z-20 rounded-full bg-primary/80 p-2 text-white shadow-lg hover:bg-primary"
          aria-label="Zum Ende scrollen"
        >
          ↓
        </button>
      )}
    </div>
  );
}
