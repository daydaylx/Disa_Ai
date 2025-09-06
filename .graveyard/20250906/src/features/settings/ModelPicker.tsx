import React from "react";
import { PersonaContext, type PersonaModel } from "@/entities/persona";
import { useSettings } from "@/entities/settings/store";
import { cn } from "@/shared/lib/cn";

export default function ModelPicker() {
  const { data } = React.useContext(PersonaContext);
  const settings = useSettings();
  const models: PersonaModel[] = data.models ?? [];
  const active = settings.modelId;

  return (
    <div className="flex max-h-[50vh] flex-col gap-2 overflow-auto pr-1">
      {models.length === 0 && <div className="text-sm opacity-70">Keine Modelle vorhanden.</div>}
      {models.map((m) => {
        const selected = active === m.id;
        return (
          <button
            key={m.id}
            className={cn(
              "min-h-[48px] w-full rounded-xl border px-3 py-2 text-left transition-colors",
              "flex items-center gap-2",
              selected ? "border-black bg-black/5" : "border-black/10 hover:bg-black/5",
              "dark:border-white/10 dark:hover:bg-white/10",
            )}
            title={`${m.label} (${m.id})`}
            onClick={() => settings.setModelId(m.id)}
          >
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium">{m.label}</div>
              <div className="truncate text-xs text-muted-foreground">{m.id}</div>
            </div>
            {selected && <span className="text-xs opacity-70">Aktiv</span>}
          </button>
        );
      })}
    </div>
  );
}
