import * as React from "react";

import { usePersonaSelection } from "../config/personas";
import { cn } from "../lib/cn";

/** QuickBar (falls genutzt) */
const PersonaQuickBar: React.FC = () => {
  const { styles, styleId, setStyleId, loading } = usePersonaSelection();
  if (loading || !styles.length) return null;

  // Professional color palette with subtle accent variations
  const colors = [
    "from-slate-600 to-slate-700 border-slate-400/40 text-white shadow-slate-400/25 hover:shadow-slate-400/40",
    "from-indigo-600/90 to-indigo-700/90 border-indigo-400/40 text-white shadow-indigo-400/25 hover:shadow-indigo-400/40",
    "from-teal-600/90 to-teal-700/90 border-teal-400/40 text-white shadow-teal-400/25 hover:shadow-teal-400/40",
    "from-emerald-600/90 to-emerald-700/90 border-emerald-400/40 text-white shadow-emerald-400/25 hover:shadow-emerald-400/40",
    "from-amber-600/90 to-amber-700/90 border-amber-400/40 text-white shadow-amber-400/25 hover:shadow-amber-400/40",
    "from-rose-600/90 to-rose-700/90 border-rose-400/40 text-white shadow-rose-400/25 hover:shadow-rose-400/40",
    "from-purple-600/90 to-purple-700/90 border-purple-400/40 text-white shadow-purple-400/25 hover:shadow-purple-400/40",
    "from-blue-600/90 to-blue-700/90 border-blue-400/40 text-white shadow-blue-400/25 hover:shadow-blue-400/40",
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
              "rounded-xl border px-4 py-2 text-sm font-medium backdrop-blur-sm transition-all duration-300 hover:scale-105",
              styleId === s.id
                ? `bg-gradient-to-r ${colorClass} scale-105 shadow-xl`
                : "border-gray-500/40 bg-gradient-to-r from-gray-600/80 to-gray-700/80 text-gray-200 shadow-lg hover:border-gray-400/50 hover:from-gray-500/80 hover:to-gray-600/80 hover:shadow-xl",
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
