import React from "react";
import { usePersonaSelection, type StyleItem } from "../config/personas";
import { cn } from "../lib/cn";

/** Nur für Tests behalten – UI bindet die QuickBar nicht mehr ein. */
const PersonaQuickBar: React.FC = () => {
  const { styles, styleId, setStyleId, loading } = usePersonaSelection();
  if (loading || !styles?.length) return null;

  return (
    <div className="flex flex-wrap gap-2" data-testid="persona-quickbar">
      {styles.map((s: StyleItem) => (
        <button
          key={s.id}
          type="button"
          onClick={() => setStyleId(s.id)}
          aria-pressed={styleId === s.id}
          className={cn(
            "px-3 py-1 rounded-full text-sm border border-zinc-700 bg-zinc-800/60 hover:bg-zinc-700 transition",
            styleId === s.id && "bg-violet-600 text-white border-transparent"
          )}
        >
          {s.name}
        </button>
      ))}
    </div>
  );
};

export default PersonaQuickBar;
export { PersonaQuickBar };
