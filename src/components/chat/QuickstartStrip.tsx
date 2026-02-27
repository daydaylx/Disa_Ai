import { useState } from "react";

import { type Quickstart } from "@/config/quickstarts";
import { cn } from "@/lib/utils";

interface QuickstartStripProps {
  quickstarts: Quickstart[];
  onSelect: (q: Quickstart) => void;
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

const CATEGORY_DOT: Record<string, string> = {
  realpolitik: "bg-accent-realpolitik",
  hypothetisch: "bg-accent-hypothetisch",
  wissenschaft: "bg-accent-wissenschaft",
  kultur: "bg-accent-kultur",
  verschwörungstheorien: "bg-accent-verschwörung",
};

export function QuickstartStrip({ quickstarts, onSelect }: QuickstartStripProps) {
  const [picks] = useState(() => shuffle(quickstarts).slice(0, 8));

  return (
    <div
      className="w-full max-w-xs overflow-x-auto no-scrollbar"
      role="list"
      aria-label="Themenvorschläge"
    >
      <div className="flex gap-2 px-1 py-1">
        {picks.map((q, i) => {
          const dotClass = q.category
            ? (CATEGORY_DOT[q.category] ?? "bg-ink-tertiary")
            : "bg-ink-tertiary";
          return (
            <button
              key={q.id}
              type="button"
              role="listitem"
              onClick={() => onSelect(q)}
              className={cn(
                "animate-fade-in-slide-up",
                "shrink-0 flex items-center gap-1.5",
                "h-7.5 rounded-full px-3",
                "text-xs text-ink-secondary",
                "bg-white/5 border border-white/[0.08]",
                "hover:bg-white/10 hover:text-ink-primary",
                "transition-colors duration-150",
                "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-primary/50",
              )}
              style={{ animationDelay: `${i * 60}ms`, animationFillMode: "both" }}
            >
              <span
                aria-hidden="true"
                className={cn("h-1.5 w-1.5 shrink-0 rounded-full", dotClass)}
              />
              {q.title}
            </button>
          );
        })}
      </div>
    </div>
  );
}
