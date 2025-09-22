import React, { useCallback, useEffect, useId, useRef, useState } from "react";

/** WAI-ARIA Accordion (APG) */
export type AccordionItem = {
  id?: string;
  title: string;
  meta?: string;
  content: React.ReactNode;
  defaultOpen?: boolean;
};

export default function Accordion({
  items,
  single = false,
}: {
  items: AccordionItem[];
  single?: boolean;
}) {
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
        const next = new Set(prev);
        if (single) {
          next.clear();
          next.add(i);
        } else {
          next.has(i) ? next.delete(i) : next.add(i);
        }
        return next;
      });
    },
    [single],
  );

  const onKeyDown = (e: React.KeyboardEvent, i: number) => {
    const n = items.length;
    let t = i;
    if (e.key === "ArrowDown") t = (i + 1) % n;
    else if (e.key === "ArrowUp") t = (i - 1 + n) % n;
    else if (e.key === "Home") t = 0;
    else if (e.key === "End") t = n - 1;
    else return;
    e.preventDefault();
    headerRefs.current[t]?.focus();
  };

  return (
    <div role="group" aria-label="Accordion">
      {items.map((it, i) => {
        const hid = `${uid}-header-${i}`;
        const pid = `${uid}-panel-${i}`;
        const isOpen = openSet.has(i);
        return (
          <div key={it.id ?? i} className="mb-2">
            <button
              ref={(el) => (headerRefs.current[i] = el)}
              id={hid}
              aria-controls={pid}
              aria-expanded={isOpen}
              onClick={() => toggle(i)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className="hover:bg-white/7 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-3 text-left focus-visible:ring-2 focus-visible:ring-violet-400"
              style={{ minHeight: 56 }}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate font-medium">{it.title}</div>
                  {it.meta && <div className="truncate text-xs text-muted/80">{it.meta}</div>}
                </div>
                <span aria-hidden className={"transition-transform " + (isOpen ? "rotate-90" : "")}>
                  ▸
                </span>
              </div>
            </button>
            <div
              id={pid}
              role="region"
              aria-labelledby={hid}
              hidden={!isOpen}
              className="bg-white/3 rounded-b-lg border-b border-l border-r border-white/10 px-3 pb-3 pt-2"
            >
              {it.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}
