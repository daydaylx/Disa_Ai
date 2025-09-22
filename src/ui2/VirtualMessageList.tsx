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

  useEffect(() => {
    // Auto-Scroll bei neuen Messages
    const el = containerRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [items.length]);

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

  return (
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
        <div className="mt-16 text-center text-muted">
          <p className="text-sm">Noch nichts passiert.</p>
          <p className="text-xs opacity-80">Schreib unten etwas oder wähle ein Modell.</p>
        </div>
      ) : (
        slice.map((m) => <div key={m.id}>{renderItem(m)}</div>)
      )}
    </div>
  );
}
