import * as React from "react";

import { usePersonaSelection } from "../config/personas";
import { cn } from "../lib/utils/cn";

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
            "chip",
            styleId === s.id && "bg-accent-500 text-[var(--accent-foreground)]",
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
