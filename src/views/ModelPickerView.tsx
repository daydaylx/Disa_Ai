import * as React from "react";

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
      <header className="space-y-1">
        <p className="text-xs uppercase tracking-wide text-text-muted">Chat-Konfiguration</p>
        <h1 className="text-2xl font-semibold">Modell auswählen</h1>
        <p className="text-sm text-text-muted">
          Suche und filtere Modelle nach Preis, Kontextfenster und Sicherheitseinstufung.
        </p>
      </header>

      <section className="card space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="card-title">Katalog</h2>
            <p className="help">Favoriten markieren, Filter kombinieren, direkt übernehmen.</p>
          </div>
          <div className="text-xs text-text-muted">
            aktiv:
            <span className="rounded px-1.5 py-0.5 ml-1 bg-surface-200 font-mono text-[0.65rem]">
              {modelId ?? "—"}
            </span>
          </div>
        </div>

        <ModelPicker value={modelId} onChange={handleSelect} policyFromRole={policyFromRole} />

        {onSelectChat && (
          <div className="flex justify-end">
            <Button variant="ghost" onClick={onSelectChat} data-testid="model-picker-back">
              Zurück zum Chat
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
