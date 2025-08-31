import React from "react";

import { usePersonaSelection } from "../config/personas";
import { cn } from "../lib/cn";

/** QuickBar (falls genutzt) */
const PersonaQuickBar: React.FC = () => {
  const { styles, styleId, setStyleId, loading } = usePersonaSelection();
  if (loading || !styles.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {styles.map((s) => (
        <button
          key={s.id}
          onClick={() => setStyleId(s.id)}
          className={cn(
            "px-3 py-1 rounded-full text-sm border transition",
            styleId === s.id
              ? "bg-violet-600/20 border-violet-500 text-violet-200"
              : "bg-zinc-800/40 border-zinc-700 hover:border-violet-500/60",
          )}
          aria-pressed={styleId === s.id}
        >
          {s.name}
        </button>
      ))}
    </div>
  );
};

export default PersonaQuickBar;
