import React, { Suspense, useEffect, useMemo, useState, lazy } from "react";
import "../styles/settings.css";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { useToasts } from "../components/ui/Toast";
import { loadSettings, saveSettings } from "../features/settings/storage";
import { PageSkeleton } from "../components/feedback/PageSkeleton";

const ModelPicker = lazy(() =>
  import("../features/models/ModelPicker").then((m) => ({ default: m.ModelPicker })),
);

export interface OnboardingProps {
  onDone?: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onDone }) => {
  const { push } = useToasts();
  const initial = useMemo(() => loadSettings(), []);
  const [apiKey, setApiKey] = useState(initial.openrouterKey ?? "");
  const [modelId, setModelId] = useState<string | undefined>(initial.defaultModelId);
  const [openPicker, setOpenPicker] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", initial.theme === "dark");
  }, [initial.theme]);

  const canFinish = apiKey.trim().length > 0 && !!modelId;

  const handleSave = () => {
    try {
      const patch: any = { openrouterKey: apiKey.trim() };
      if (modelId) patch.defaultModelId = modelId;
      saveSettings(patch);
      push({ kind: "success", title: "Gespeichert", message: "Onboarding abgeschlossen" });
      onDone?.();
    } catch (e: any) {
      push({ kind: "error", title: "Fehler", message: e?.message ?? "Ungültige Einstellungen" });
    }
  };

  return (
    <div className="px-3 py-4">
      <section className="onboarding-hero">
        <h1 className="text-2xl font-semibold">Willkommen bei Disa&nbsp;Ai</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Zwei Schritte – dann kannst du direkt loslegen.
        </p>
      </section>

      <div className="onboarding-card mt-4">
        <div className="settings-section p-3">
          <h3>1) OpenRouter API-Key</h3>
          <p className="settings-desc mt-1">
            Wird lokal gespeichert. Benötigt für Live-Modelle und Antworten.
          </p>
          <div className="settings-row mt-3">
            <div className="md:col-span-2">
              <Input
                label="API-Key"
                placeholder="sk-…"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                autoComplete="off"
              />
            </div>
            <div className="settings-actions">
              <Button variant="secondary" onClick={() => setApiKey("")}>
                Leeren
              </Button>
            </div>
          </div>
        </div>

        <div className="settings-section mt-3 p-3">
          <h3>2) Standardmodell</h3>
          <p className="settings-desc mt-1">
            Wähle ein empfohlenes Modell. Später jederzeit änderbar.
          </p>
          <div className="mt-3 flex items-center justify-between gap-2">
            <div className="text-sm">
              Ausgewählt: <span className="font-medium">{modelId ?? "– keines –"}</span>
            </div>
            <div className="settings-actions">
              <Button variant="secondary" onClick={() => setOpenPicker(true)}>
                Modell wählen
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-end gap-2">
          <Button variant="secondary" onClick={() => onDone?.()}>
            Später
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={!canFinish}>
            Los geht’s
          </Button>
        </div>
      </div>

      <Suspense fallback={<PageSkeleton />}>
        <ModelPicker
          open={openPicker}
          onOpenChange={setOpenPicker}
          {...(modelId ? { value: modelId } : {})}
          onChange={setModelId}
          onOpenSettings={() => {}}
        />
      </Suspense>
    </div>
  );
};

export default Onboarding;
