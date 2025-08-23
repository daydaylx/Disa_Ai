import React from "react";
import { usePersonaSelection } from "../config/personas";
import { cn } from "../lib/cn";

export function PersonaQuickBar() {
  const { personas, personaId, setPersonaId, loading } = usePersonaSelection();
  if (loading || personas.length <= 1) return null;

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 -mb-1">
      {personas.map(p => {
        const active = p.id === personaId;
        return (
          <button
            key={p.id}
            onClick={() => setPersonaId(p.id)}
            className={cn(
              "h-8 px-3 rounded-full text-xs whitespace-nowrap border",
              active
                ? "border-fuchsia-500/50 bg-fuchsia-500/15 text-fuchsia-200"
                : "border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10"
            )}
            title={p.label}
          >
            {p.label}
          </button>
        );
      })}
    </div>
  );
}
