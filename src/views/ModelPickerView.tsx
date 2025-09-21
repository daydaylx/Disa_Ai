import * as React from "react";

import { GlassCard } from "../components/glass/GlassCard";
import ModelPicker from "../components/ModelPicker";
import { Button } from "../components/ui/Button";
import { useToasts } from "../components/ui/Toast";
import { type Safety } from "../config/models";
import { getRoleById } from "../config/roleStore";
import { getSelectedModelId, getTemplateId, setSelectedModelId } from "../config/settings";

type RolePolicy = Safety | "any";

type Props = {
  onSelectChat?: () => void;
};

export default function ModelPickerView({ onSelectChat }: Props) {
  const toasts = useToasts();
  const [modelId, setModelId] = React.useState<string | null>(() => getSelectedModelId());
  const templateId = React.useMemo(() => getTemplateId(), []);

  const policyFromRole: RolePolicy = React.useMemo(() => {
    const role = getRoleById(templateId);
    const policy = role?.policy;
    return policy === "loose" || policy === "moderate" || policy === "strict" ? policy : "any";
  }, [templateId]);

  const handleSelect = React.useCallback(
    (id: string) => {
      setModelId(id);
      setSelectedModelId(id);
      toasts.push({ kind: "success", title: "Modell aktualisiert", message: id });
      if (onSelectChat) {
        // Give the toast a brief moment before navigating away.
        if (typeof window !== "undefined") {
          window.setTimeout(() => onSelectChat(), 120);
        } else {
          onSelectChat();
        }
      }
    },
    [onSelectChat, toasts],
  );

  return (
    <div
      className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-6"
      style={{
        paddingBottom: "calc(env(safe-area-inset-bottom) + var(--bottomnav-h, 56px) + 32px)",
      }}
    >
      <GlassCard variant="floating" tint="purple" className="p-8 text-center">
        <div className="mb-4 flex items-center justify-center gap-3">
          <div className="bg-purple-500/20 rounded-xl p-3">
            <span className="text-3xl">🤖</span>
          </div>
          <div className="text-left">
            <p className="text-neutral-400 mb-1 text-xs uppercase tracking-wide">
              Chat-Konfiguration
            </p>
            <h1 className="text-3xl from-purple-400 to-cyan-400 bg-gradient-to-r bg-clip-text font-bold text-transparent">
              Modell auswählen
            </h1>
            <p className="text-neutral-300 text-lg">
              Suche und filtere Modelle nach Preis, Kontextfenster und Sicherheitseinstufung.
            </p>
          </div>
        </div>
      </GlassCard>

      <GlassCard variant="medium" className="space-y-4 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-white text-xl font-semibold">Katalog</h2>
            <p className="text-neutral-400 text-sm">
              Favoriten markieren, Filter kombinieren, direkt übernehmen.
            </p>
          </div>
          <div className="glass-badge glass-badge--accent">aktiv: {modelId ?? "—"}</div>
        </div>

        <ModelPicker value={modelId} onChange={handleSelect} policyFromRole={policyFromRole} />

        {onSelectChat && (
          <div className="flex justify-end">
            <Button variant="ghost" onClick={onSelectChat} data-testid="model-picker-back">
              Zurück zum Chat
            </Button>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
