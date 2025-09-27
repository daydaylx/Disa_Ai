import * as React from "react";

import { usePersonaSelection } from "../config/personas";
import { cn } from "../lib/cn";

/** QuickBar (falls genutzt) */
const PersonaQuickBar: React.FC = () => {
  const { styles, styleId, setStyleId, loading } = usePersonaSelection();
  if (loading || !styles.length) return null;

  // Professional neutral color variations
  const colors = [
    "from-slate-600 to-slate-700 border-slate-500/50 text-white shadow-slate-500/20",
    "from-gray-600 to-gray-700 border-gray-500/50 text-white shadow-gray-500/20",
    "from-zinc-600 to-zinc-700 border-zinc-500/50 text-white shadow-zinc-500/20",
    "from-neutral-600 to-neutral-700 border-neutral-500/50 text-white shadow-neutral-500/20",
    "from-stone-600 to-stone-700 border-stone-500/50 text-white shadow-stone-500/20",
  ];

  return (
    <div className="flex flex-wrap gap-3">
      {styles.map((s, index) => {
        const colorClass = colors[index % colors.length];
        return (
          <button
            key={s.id}
            onClick={() => setStyleId(s.id)}
            className={cn(
              "rounded-xl border px-4 py-2 text-sm font-medium transition-all duration-200 hover:scale-105",
              styleId === s.id
                ? `bg-gradient-to-r ${colorClass} scale-105 shadow-lg`
                : "border-gray-500/50 bg-gradient-to-r from-gray-600 to-gray-700 text-gray-200 shadow-md hover:from-gray-500 hover:to-gray-600",
            )}
            aria-pressed={styleId === s.id}
          >
            <span className="drop-shadow-sm">{s.name}</span>
          </button>
        );
      })}
    </div>
  );
};

export default PersonaQuickBar;
