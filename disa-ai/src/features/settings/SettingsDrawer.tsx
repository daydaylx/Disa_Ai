import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { ModelInfo } from "@/lib/types";
import { OpenRouterClient } from "@/lib/openrouter";

type Props = {
  open: boolean;
  onClose: () => void;
  client: OpenRouterClient;

  modelId: string;
  onModelChange: (id: string) => void;

  onKeyChanged: () => void;

  personaLabel?: string;
  onOpenPersona: () => void;

  models: ModelInfo[];
};

export default function SettingsDrawer({
  open, onClose, client,
  modelId, onModelChange, onKeyChanged,
  personaLabel, onOpenPersona,
  models
}: Props) {
  const [key, setKey] = useState<string>("");

  useEffect(() => { setKey(client.getApiKey() ?? ""); }, [client, open]);

  function saveKey() {
    if (key.trim()) client.setApiKey(key.trim());
    else client.clearApiKey();
    onKeyChanged();
  }
  function clearKey() {
    client.clearApiKey();
    setKey("");
    onKeyChanged();
  }

  if (!open) return null;

  return (
    <>
      <motion.div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={onClose} />
      <motion.div
        className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl border border-border bg-background p-4 pb-[max(16px,env(safe-area-inset-bottom))] shadow-2xl"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        transition={{ type: "spring", damping: 26, stiffness: 300 }}
      >
        <div className="mx-auto max-w-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Einstellungen</h2>
            <button onClick={onClose} className="rounded-lg border border-border/60 px-3 py-2 text-sm text-muted-foreground hover:bg-secondary/60">Schließen</button>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">OpenRouter API-Key</label>
            <div className="flex gap-2">
              <input
                type="password"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="sk-or-…"
                className="flex-1 rounded-xl border border-border/60 bg-secondary/60 px-3 py-2 outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/30"
              />
              <button onClick={saveKey} className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">Speichern</button>
              <button onClick={clearKey} className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive hover:bg-destructive/20">Löschen</button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Modell</label>
            <select
              value={modelId}
              onChange={(e) => onModelChange(e.target.value)}
              className="w-full rounded-xl border border-border/60 bg-secondary/60 px-3 py-2 outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/30"
            >
              {models.map((m) => (
                <option key={m.id} value={m.id}>{m.label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Persona</label>
            <div className="flex items-center gap-2">
              <div className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                {personaLabel ?? "—"}
              </div>
              <button onClick={onOpenPersona} className="rounded-lg border border-border/60 px-3 py-2 text-sm text-muted-foreground hover:bg-secondary/60">
                Auswählen…
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
