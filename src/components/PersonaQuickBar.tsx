import * as React from "react";

import { usePersonaSelection } from "../config/personas";
import { cn } from "../lib/cn";

/** QuickBar (falls genutzt) */
const PersonaQuickBar: React.FC = () => {
  const { styles, styleId, setStyleId, loading } = usePersonaSelection();
  if (loading || !styles.length) return null;

  const colors = [
    "from-red-500 to-pink-500 border-red-400/50 text-white shadow-red-500/20",
    "from-purple-500 to-indigo-500 border-purple-400/50 text-white shadow-purple-500/20",
    "from-blue-500 to-cyan-500 border-blue-400/50 text-white shadow-blue-500/20",
    "from-green-500 to-emerald-500 border-green-400/50 text-white shadow-green-500/20",
    "from-yellow-500 to-orange-500 border-yellow-400/50 text-white shadow-yellow-500/20",
    "from-pink-500 to-rose-500 border-pink-400/50 text-white shadow-pink-500/20",
    "from-indigo-500 to-purple-500 border-indigo-400/50 text-white shadow-indigo-500/20",
    "from-cyan-500 to-blue-500 border-cyan-400/50 text-white shadow-cyan-500/20",
    "from-emerald-500 to-teal-500 border-emerald-400/50 text-white shadow-emerald-500/20",
    "from-orange-500 to-red-500 border-orange-400/50 text-white shadow-orange-500/20",
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
              "rounded-full border-2 px-4 py-2 text-sm font-semibold transition-all duration-200 hover:rotate-1 hover:scale-110",
              styleId === s.id
                ? `bg-gradient-to-r ${colorClass} scale-110 animate-pulse shadow-lg`
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
