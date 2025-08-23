import React from "react";
import { Button } from "@/shared/ui/Button";
import { useSettings } from "@/entities/settings/store";
import { PersonaContext } from "@/entities/persona";

export function Header({ onOpenSettings }: { onOpenSettings: (tab?: "api" | "model" | "style") => void }) {
  const settings = useSettings();
  const persona = React.useContext(PersonaContext);

  const modelLabel = React.useMemo(() => {
    const id = settings.modelId;
    if (!id) return "Kein Modell";
    return persona.data.models.find((m) => m.id === id)?.label ?? id;
  }, [settings.modelId, persona.data.models]);

  const styleLabel = React.useMemo(() => {
    const id = settings.personaId ?? "neutral";
    return persona.data.styles.find((s) => s.id === id)?.name ?? id;
  }, [settings.personaId, persona.data.styles]);

  return (
    <div className="sticky top-0 z-40 bg-white/80 dark:bg-neutral-950/80 backdrop-blur border-b border-black/10 dark:border-white/10">
      <div className="px-3 py-2 flex items-center justify-between">
        <div className="font-semibold">Disa AI</div>
        <div className="flex items-center gap-2 min-w-0">
          <button
            className="px-3 h-9 rounded-full border border-black/10 dark:border-white/10 max-w-[35vw] truncate"
            title={modelLabel}
            onClick={() => onOpenSettings("model")}
          >
            {modelLabel}
          </button>
          <button
            className="px-3 h-9 rounded-full border border-black/10 dark:border-white/10 max-w-[35vw] truncate"
            title={styleLabel}
            onClick={() => onOpenSettings("style")}
          >
            {styleLabel}
          </button>
          <Button variant="outline" size="sm" onClick={() => onOpenSettings("api")}>API</Button>
        </div>
      </div>
    </div>
  );
}
