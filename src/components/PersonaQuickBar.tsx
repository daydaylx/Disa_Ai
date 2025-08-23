import React from "react";
import { usePersonaSelection } from "@/config/personas";
import { cn } from "@/lib/cn";

/**
 * Minimaler QuickBar-Streifen: listet Styles aus persona.json
 * Nutzt die neue Selection-API (styles/styleId/setStyleId).
 * Wird in der App nicht mehr angezeigt, bleibt aber für Unit-Tests bestehen.
 */
const PersonaQuickBar: React.FC = () => {
  const { styles, styleId, setStyleId, loading } = usePersonaSelection();

  if (loading || !styles || styles.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {styles.map((s) => (
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
