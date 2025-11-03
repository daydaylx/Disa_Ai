import React, { useCallback, useEffect, useId, useRef, useState } from "react";

import { cn } from "../../lib/utils";

type AccordionItem = {
  id?: string;
  title: string;
  meta?: string;
  content: React.ReactNode;
  defaultOpen?: boolean;
};

function Accordion({ items, single = false }: { items: AccordionItem[]; single?: boolean }) {
  const uid = useId();
  const [openSet, setOpenSet] = useState<Set<number>>(
    new Set(items.map((it, i) => (it.defaultOpen ? i : -1)).filter((i) => i >= 0)),
  );
  const headerRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    headerRefs.current = headerRefs.current.slice(0, items.length);
  }, [items.length]);

  const toggle = useCallback(
    (i: number) => {
      setOpenSet((prev) => {
        if (single) {
          const isOpen = prev.has(i);
          const next = new Set<number>();
          if (!isOpen) {
            next.add(i);
          }
          return next;
        }
        const next = new Set(prev);
        next.has(i) ? next.delete(i) : next.add(i);
        return next;
      });
    },
    [single],
  );

  const onKeyDown = (e: React.KeyboardEvent, i: number) => {
    const count = items.length;
    let target = i;
    if (e.key === "ArrowDown") target = (i + 1) % count;
    else if (e.key === "ArrowUp") target = (i - 1 + count) % count;
    else if (e.key === "Home") target = 0;
    else if (e.key === "End") target = count - 1;
    else return;
    e.preventDefault();
    headerRefs.current[target]?.focus();
  };

  return (
    <div role="group" aria-label="Accordion" className="space-y-3">
      {items.map((it, i) => {
        const hid = `${uid}-header-${i}`;
        const pid = `${uid}-panel-${i}`;
        const isOpen = openSet.has(i);
        return (
          <div key={it.id ?? i} className="group">
            {/* Dramatic Neomorphic Accordion Header */}
            <button
              ref={(el) => {
                headerRefs.current[i] = el;
              }}
              id={hid}
              aria-controls={pid}
              aria-expanded={isOpen}
              onClick={() => toggle(i)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={cn(
                "w-full text-left transition-all duration-300 ease-out",
                "rounded-[var(--radius-lg)] px-6 py-4",
                // Neomorphic Base Styling
                "bg-[var(--surface-neumorphic-raised)]",
                "shadow-[var(--shadow-neumorphic-md)]",
                "border border-[var(--border-neumorphic-light)]",
                // Enhanced States
                "hover:shadow-[var(--shadow-neumorphic-lg)]",
                "hover:-translate-y-0.5",
                "hover:bg-[var(--surface-neumorphic-floating)]",
                // Focus State
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--acc1)]/50 focus-visible:ring-offset-2",
                "focus-visible:shadow-[var(--shadow-neumorphic-lg)]",
                // Open State - Dramatically Enhanced
                isOpen &&
                  [
                    "bg-gradient-to-br from-[var(--surface-neumorphic-floating)] to-[var(--surface-neumorphic-raised)]",
                    "shadow-[var(--shadow-neumorphic-lg)]",
                    "border-[var(--acc1)]/30",
                    "rounded-b-none",
                    "-translate-y-1",
                  ].join(" "),
              )}
              style={{ minHeight: 64 }}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div
                    className={cn(
                      "truncate font-semibold transition-colors duration-200",
                      "text-[var(--color-text-primary)]",
                      isOpen && "text-[var(--acc1)]",
                    )}
                  >
                    {it.title}
                  </div>
                  {it.meta && (
                    <div
                      className={cn(
                        "truncate text-xs mt-1 transition-colors duration-200",
                        "text-[var(--color-text-secondary)]",
                        isOpen && "text-[var(--color-text-primary)]",
                      )}
                    >
                      {it.meta}
                    </div>
                  )}
                </div>

                {/* Dramatic Chevron */}
                <div
                  className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300",
                    "bg-[var(--surface-neumorphic-base)]",
                    "shadow-[var(--shadow-inset-subtle)]",
                    "border border-[var(--border-neumorphic-subtle)]",
                    isOpen &&
                      [
                        "bg-[var(--acc1)]",
                        "shadow-[var(--shadow-neumorphic-sm)]",
                        "transform rotate-90 scale-110",
                        "border-[var(--acc1)]",
                      ].join(" "),
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "text-lg font-bold transition-all duration-300",
                      "text-[var(--color-text-secondary)]",
                      isOpen ? "text-white rotate-90" : "",
                    )}
                  >
                    ▸
                  </span>
                </div>
              </div>
            </button>

            {/* Dramatic Neomorphic Content Panel */}
            <div
              id={pid}
              role="region"
              aria-labelledby={hid}
              hidden={!isOpen}
              className={cn(
                "transition-all duration-500 ease-out",
                "bg-[var(--surface-neumorphic-floating)]",
                "shadow-[var(--shadow-neumorphic-lg)]",
                "border-x border-b border-[var(--border-neumorphic-light)]",
                "rounded-b-[var(--radius-lg)]",
                "px-6 py-4",
                // Animation
                "animate-in slide-in-from-top-2 fade-in-0 duration-300",
                // Enhanced visual depth
                "relative",
                "before:absolute before:inset-0 before:rounded-b-[var(--radius-lg)]",
                "before:bg-gradient-to-b before:from-transparent before:to-white/5",
                "before:pointer-events-none",
              )}
            >
              <div className="relative z-10 text-[var(--color-text-secondary)] leading-relaxed">
                {it.content}
              </div>

              {/* Inner Glow Effect */}
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-8 opacity-10 pointer-events-none"
                style={{
                  background: "linear-gradient(180deg, rgba(255,255,255,0.4) 0%, transparent 100%)",
                  filter: "blur(8px)",
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export { type AccordionItem };
export default Accordion;
