import React from "react";
import { useClient } from "@/lib/client";
import { PersonaContext } from "@/entities/persona";
import { useSettings } from "@/entities/settings/store";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import ModelPicker from "./ModelPicker";

export default function SettingsSheet({ onClose, initial }: { onClose: () => void; initial?: "api" | "model" | "style"; }) {
  const { apiKey, setApiKey } = useClient();
  const { data } = React.useContext(PersonaContext);
  const settings = useSettings();
  const [tab, setTab] = React.useState<"api"|"model"|"style">(initial ?? "api");

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-end sm:items-center justify-center" role="dialog" aria-modal="true">
      <div className="w-full sm:max-w-lg bg-white dark:bg-neutral-900 rounded-t-2xl sm:rounded-2xl shadow-lg">
        <div className="flex items-center justify-between p-3 border-b border-black/10 dark:border-white/10">
          <div className="flex gap-2">
            <Button variant={tab==="api"?"default":"outline"} onClick={()=>setTab("api")} size="sm">API</Button>
            <Button variant={tab==="model"?"default":"outline"} onClick={()=>setTab("model")} size="sm">Modell</Button>
            <Button variant={tab==="style"?"default":"outline"} onClick={()=>setTab("style")} size="sm">Stil</Button>
          </div>
          <Button variant="ghost" onClick={onClose} aria-label="Schließen">Schließen</Button>
        </div>

        <div className="p-4">
          {tab === "api" && (
            <div className="space-y-3">
              <label className="text-sm">OpenRouter API-Key</label>
              <Input placeholder="sk-or-v1-…" value={apiKey ?? ""} onChange={(e)=>setApiKey((e.target as HTMLInputElement).value || null)} aria-label="OpenRouter API Key" />
              <div className="text-xs text-muted">Wird lokal im Browser gespeichert. Keine Telemetrie.</div>
            </div>
          )}
          {tab === "model" && <ModelPicker />}
          {tab === "style" && (
            <div className="grid grid-cols-1 gap-2">
              {data.styles.map((s) => {
                const selected = settings.personaId === s.id;
                return (
                  <button key={s.id}
                    onClick={()=>settings.setPersonaId(s.id)}
                    className={"min-h-[48px] px-3 py-2 rounded-xl text-left border " + (selected ? "border-black bg-black/5" : "border-black/10 hover:bg-black/5") + " dark:border-white/10 dark:hover:bg-white/10"}>
                    <div className="text-sm font-medium truncate">{s.name}</div>
                    <div className="text-xs text-muted truncate">{s.id}</div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
