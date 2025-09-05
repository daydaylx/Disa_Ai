import React, { Suspense, useEffect, useMemo, useState, lazy } from "react";
import "../styles/settings.css";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { Button } from "../components/ui/Button";
import { useToasts } from "../components/ui/Toast";
import { loadSettings, saveSettings } from "../features/settings/storage";
import type { Theme } from "../features/settings/schema";
import { PageSkeleton } from "../components/feedback/PageSkeleton";

const ModelPicker = lazy(() => import("../features/models/ModelPicker").then(m => ({ default: m.ModelPicker })));

export const SettingsView: React.FC = () => {
  const { push } = useToasts();
  const initial = useMemo(() => loadSettings(), []);
  const [theme, setTheme] = useState<Theme>(initial.theme);
  const [apiKey, setApiKey] = useState(initial.openrouterKey ?? "");
  const [modelId, setModelId] = useState<string | undefined>(initial.defaultModelId);
  const [openPicker, setOpenPicker] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    if (theme === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      document.documentElement.classList.toggle("dark", mq.matches);
    }
  }, [theme]);

  const handleSave = () => {
    try {
      const patch: any = { theme, openrouterKey: apiKey.trim() };
      if (modelId) patch.defaultModelId = modelId;
      saveSettings(patch);
      push({ kind: "success", title: "Gespeichert", message: "Einstellungen übernommen" });
    } catch (e: any) {
      push({ kind: "error", title: "Fehler", message: e?.message ?? "Ungültige Einstellungen" });
    }
  };

  return (
    <div className="px-3 py-4">
      <h1 className="text-xl font-semibold">Einstellungen</h1>

      <section className="settings-section p-3 mt-3">
        <h3>Darstellung</h3>
        <p className="settings-desc mt-1">Theme nur per Klasse – systembasiert, hell oder dunkel.</p>
        <div className="mt-3 max-w-sm">
          <Select
            label="Theme"
            value={theme}
            onChange={(e) => setTheme(e.target.value as Theme)}
            options={[
              { value: "system", label: "System" },
              { value: "light", label: "Hell" },
              { value: "dark", label: "Dunkel" },
            ]}
          />
        </div>
      </section>

      <section className="settings-section p-3 mt-3">
        <h3>OpenRouter API-Key</h3>
        <p className="settings-desc mt-1">Wird lokal gespeichert. Benötigt für Live-Modelle und Antworten.</p>
        <div className="mt-3 settings-row">
          <div className="md:col-span-2">
            <Input label="API-Key" placeholder="sk-…" value={apiKey} onChange={(e) => setApiKey(e.target.value)} autoComplete="off" />
          </div>
          <div className="settings-actions">
            <Button variant="secondary" onClick={() => setApiKey("")}>Leeren</Button>
          </div>
        </div>
      </section>

      <section className="settings-section p-3 mt-3">
        <h3>Standardmodell</h3>
        <p className="settings-desc mt-1">Ausgewähltes Modell wird als Default genutzt.</p>
        <div className="mt-3 flex items-center justify-between gap-2">
          <div className="text-sm">Aktuell: <span className="font-medium">{modelId ?? "– keines –"}</span></div>
          <div className="settings-actions">
            <Button variant="secondary" onClick={() => setOpenPicker(true)}>Modell wählen</Button>
          </div>
        </div>
      </section>

      <div className="mt-4 flex items-center justify-end gap-2">
        <Button variant="secondary" onClick={() => { loadSettings(); push({ kind: "info", title: "Verworfen", message: "Änderungen nicht gespeichert" }); }}>Verwerfen</Button>
        <Button variant="primary" onClick={handleSave}>Speichern</Button>
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

export default SettingsView;
