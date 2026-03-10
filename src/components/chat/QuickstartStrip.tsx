import { useMemo } from "react";

import { CATEGORY_LABELS, type Quickstart } from "@/config/quickstarts";
import { cn } from "@/lib/utils";

interface QuickstartStripProps {
  quickstarts: Quickstart[];
  onSelect: (q: Quickstart) => void;
  limit?: number;
  animate?: boolean;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = a[i] as T;
    a[i] = a[j] as T;
    a[j] = temp;
  }
  return a;
}

export function QuickstartStrip({
  quickstarts,
  onSelect,
  limit = 6,
  animate = true,
}: QuickstartStripProps) {
  const picks = useMemo(
    () => shuffle(quickstarts).slice(0, Math.min(limit, quickstarts.length)),
    [limit, quickstarts],
  );

  return (
    <div className="w-full">
      <ul className="grid grid-cols-2 gap-2 px-1" aria-label="Themenvorschläge">
        {picks.map((q, i) => {
          const categoryMeta = q.category ? CATEGORY_LABELS[q.category] : null;
          return (
            <li key={q.id}>
              <button
                type="button"
                onClick={() => onSelect(q)}
                className={cn(
                  "flex w-full flex-col items-start gap-1.5",
                  "rounded-2xl px-3 py-2.5",
                  "text-left",
                  "bg-white/5 border border-white/[0.08]",
                  "hover:bg-white/10",
                  "transition-colors duration-150",
                  "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-primary/50",
                  animate && "animate-fade-in-slide-up",
                )}
                style={
                  animate ? { animationDelay: `${i * 60}ms`, animationFillMode: "both" } : undefined
                }
              >
                {categoryMeta && (
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-1.5 py-0.5",
                      "text-[10px] font-medium border",
                      categoryMeta.color,
                    )}
                  >
                    {categoryMeta.label}
                  </span>
                )}
                <span className="text-xs font-medium text-ink-primary leading-snug">{q.title}</span>
                <span className="text-[11px] text-ink-tertiary leading-snug line-clamp-2">
                  {q.description}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
