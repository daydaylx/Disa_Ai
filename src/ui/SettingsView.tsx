import * as React from "react";
import { useEffect, useState } from "react";

import { GlassButton } from "../components/glass/GlassButton";
import { GlassCard } from "../components/glass/GlassCard";
import { type GlassTab, GlassTabPanel, GlassTabs } from "../components/glass/GlassTabs";
import ModelPicker from "../components/ModelPicker";
import { SettingsCard } from "../components/settings/SettingsCard";
import BottomSheet from "../components/ui/BottomSheet";
import { GlassSpinner } from "../components/ui/Skeleton";
import { useToasts } from "../components/ui/Toast";
import { labelForModel, loadModelCatalog } from "../config/models";
import { getSelectedModelId, setSelectedModelId } from "../config/settings";
import { usePWAInstall } from "../hooks/usePWAInstall";
import { getApiKey, setApiKey } from "../services/openrouter";
import SettingsRoles from "./settings/SettingsRoles";
import SettingsStyle from "./settings/SettingsStyle";

type TabKey = "general" | "style" | "roles" | "app";

export default function SettingsView() {
  const [activeTab, setActiveTab] = useState<TabKey>("general");
  const [apiKey, setApiKeyState] = useState(() => getApiKey() || "");
  const [keyError, setKeyError] = useState<string | null>(null);
  const [keySaving, setKeySaving] = useState(false);
  const toasts = useToasts();
  const pwa = usePWAInstall();

  const [isModelPickerOpen, setIsModelPickerOpen] = useState(false);
  const [modelId, setModelId] = useState(() => getSelectedModelId());
  const [modelLabel, setModelLabel] = useState("Lade...");
  const [modelCatalog, setModelCatalog] = useState<Awaited<ReturnType<typeof loadModelCatalog>>>([]);

  useEffect(() => {
    const h = window.location.hash;
    const anchor = h.split("#")[2];
    if (anchor === "style") setActiveTab("style");
    if (anchor === "roles") setActiveTab("roles");
    if (anchor === "general") setActiveTab("general");
    if (anchor === "app") setActiveTab("app");
  }, []);

  useEffect(() => {
    let ok = true;
    (async () => {
      const catalog = await loadModelCatalog();
      if (ok) {
        const current = getSelectedModelId();
        if (current) {
          const label = labelForModel(current, catalog.find((m) => m.id === current)?.label);
          setModelLabel(label);
        } else {
          setModelLabel("Kein Modell ausgewählt");
        }
      }
    })();
    return () => {
      ok = false;
    };
  }, []);

  const handleModelChange = (newModelId: string) => {
    setSelectedModelId(newModelId);
    setModelId(newModelId);
    const label = labelForModel(newModelId);
    setModelLabel(label);
    setIsModelPickerOpen(false);
    toasts.push({
      kind: "success",
      title: "Modell geändert",
      message: `Das aktive Modell ist jetzt ${label}.`,
    });
  };

  const settingsTabs: GlassTab[] = [
    {
      id: "general",
      label: "Allgemein",
      icon: "",
      "aria-label": "Allgemeine Einstellungen",
    },
    {
      id: "style",
      label: "Stil",
      icon: "",
      "aria-label": "Antwortstil-Einstellungen",
    },
    {
      id: "roles",
      label: "Rollen",
      icon: "",
      "aria-label": "KI-Rollen Einstellungen",
    },
    {
      id: "app",
      label: "App",
      icon: "",
      "aria-label": "App-Einstellungen",
    },
  ];

  const handleSaveApiKey = () => {
    const val = apiKey.trim();
    if (!val) {
      setKeyError("API-Key darf nicht leer sein.");
      return;
    }

    if (!/^sk_[a-zA-Z0-9_-]{24,}$/.test(val)) {
      setKeyError("Der Key sieht ungewöhnlich aus. Bitte prüfen und erneut versuchen.");
      return;
    }

    try {
      setKeySaving(true);
      setKeyError(null);
      setApiKey(val);
      toasts.push({
        kind: "success",
        title: "API-Key gespeichert",
        message: "Du kannst jetzt echte Antworten abrufen.",
      });
    } catch (err) {
      console.warn("API key save failed", err);
      setKeyError("Speichern nicht möglich. Bitte Browser-Speicher prüfen und erneut versuchen.");
    } finally {
      setKeySaving(false);
    }
  };

  return (
    <div className="bg-background-primary flex h-full flex-col">
      <header className="safe-pt safe-px sticky top-0 z-20 backdrop-blur-xl">
        <div className="mx-auto max-w-4xl">
          <div className="glass border-border-secondary shadow-glass flex items-center justify-between rounded-2xl px-6 py-4">
            <div>
              <h1 className="text-h2 font-bold tracking-tight text-text-primary">Einstellungen</h1>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div
                className={`flex items-center gap-2 ${apiKey ? "text-green-400" : "text-orange-400"}`}
              >
                <div
                  className={`h-2 w-2 rounded-full ${apiKey ? "bg-green-400" : "bg-orange-400"}`}
                ></div>
                <span>API {apiKey ? "verbunden" : "nicht konfiguriert"}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="safe-px with-bottomnav flex-1 overflow-y-auto pt-6">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Tab Navigation */}
          <div className="bg-glass-surface/5 border-glass-border/20 rounded-2xl border p-3">
            <GlassTabs
              tabs={settingsTabs}
              activeTab={activeTab}
              onTabChange={(tabId) => setActiveTab(tabId as TabKey)}
              fullWidth
              variant="large"
            />
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {/* General Settings Tab */}
            <GlassTabPanel tabId="general" activeTab={activeTab}>
              <div className="grid gap-6 lg:grid-cols-2">
                {/* API Configuration */}
                <SettingsCard
                  title="OpenRouter API Key"
                  description="Schlüssel wird ausschließlich lokal gespeichert. Ohne Key nutzt die App Demo-Antworten."
                  glow="cyan"
                >
                  <div className="space-y-4">
                    <div>
                      <input
                        type="password"
                        placeholder="sk-or-..."
                        value={apiKey}
                        onChange={(e) => {
                          setApiKeyState(e.target.value);
                          setKeyError(null);
                        }}
                        className="glass-input focus:shadow-accent-teal/10 w-full transition-all duration-200 focus:scale-[1.01] focus:shadow-lg"
                        data-testid="settings-save-key"
                      />
                      {keyError && <p className="mt-2 text-sm text-red-400">{keyError}</p>}
                    </div>
                    <GlassButton variant="primary" onClick={handleSaveApiKey} disabled={keySaving}>
                      <div className="flex items-center gap-2">
                        {keySaving && <GlassSpinner size="sm" />}
                        <span>{keySaving ? "Speichert..." : "Key speichern"}</span>
                      </div>
                    </GlassButton>
                    .
                  </div>
                </SettingsCard>

                {/* App Info */}
                <SettingsCard
                  title="Design System"
                  description="Professionelles Glassmorphism Design mit optimaler Lesbarkeit und modernen Effekten."
                  glow="purple"
                >
                  <div className="space-y-3">
                    <div className="glass-badge glass-badge--accent">Dark Glass Theme aktiv</div>
                    <p className="text-sm text-text-muted/85">
                      Nutzt halbtransparente Glasflächen mit Blur-Effekten für eine moderne,
                      professionelle Benutzeroberfläche.
                    </p>
                  </div>
                </SettingsCard>

                {/* Model Selection */}
                <SettingsCard
                  title="Modell-Auswahl"
                  description="Wähle das AI-Modell für optimale Ergebnisse."
                  glow="warm"
                >
                  <div className="space-y-4">
                    <div className="glass-badge glass-badge--accent">{modelLabel}</div>
                    <GlassButton
                      variant="secondary"
                      size="lg"
                      className="w-full"
                      onClick={() => setIsModelPickerOpen(true)}
                    >
                      Modell wechseln
                    </GlassButton>
                  </div>
                </SettingsCard>
              </div>
            </GlassTabPanel>

            {/* Style Settings Tab */}
            <GlassTabPanel tabId="style" activeTab={activeTab}>
              <SettingsCard
                title="Antwortstil"
                description="Wähle den Stil für KI-Antworten - von neutral bis kreativ."
                glow="cyan"
              >
                <SettingsStyle />
              </SettingsCard>
            </GlassTabPanel>

            {/* Roles Settings Tab */}
            <GlassTabPanel tabId="roles" activeTab={activeTab}>
              <SettingsCard
                title="KI-Rollen"
                description="Spezialisierte Rollen für verschiedene Anwendungsfälle."
                glow="purple"
              >
                <SettingsRoles />
              </SettingsCard>
            </GlassTabPanel>

            {/* App Settings Tab */}
            <GlassTabPanel tabId="app" activeTab={activeTab}>
              <div className="grid gap-6 lg:grid-cols-2">
                {/* App Installation */}
                <SettingsCard
                  title="App Installation"
                  description="Installiere die App für schnellen Zugriff und Offline-Unterstützung."
                  glow="mint"
                >
                  <div className="space-y-3">
                    {pwa.canInstall ? (
                      <GlassButton variant="primary" onClick={pwa.requestInstall}>
                        Jetzt installieren
                      </GlassButton>
                    ) : pwa.installed ? (
                      <div className="glass-badge glass-badge--success">
                        <div className="h-2 w-2 rounded-full bg-green-400"></div>
                        Bereits installiert
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400">
                        Installations-Aufforderung momentan nicht verfügbar.
                      </p>
                    )}
                    {pwa.showIOSHowTo && (
                      <p className="text-xs text-gray-400">
                        iOS: Über „Teilen" → „Zum Home-Bildschirm" hinzufügen
                      </p>
                    )}
                  </div>
                </SettingsCard>

                {/* Storage & Performance */}
                <SettingsCard
                  title="Speicher & Performance"
                  description="Datenmanagement und App-Optimierung."
                  glow="purple"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-white">Chat-Speicher</h4>
                        <p className="text-sm text-gray-400">
                          Automatische Speicherung der Gespräche
                        </p>
                      </div>
                      <div className="glass-badge glass-badge--success">Aktiv</div>
                    </div>

                    <div className="space-y-3">
                      <GlassButton variant="ghost" size="sm" className="w-full">
                        Cache leeren
                      </GlassButton>
                      <GlassButton variant="danger" size="sm" className="w-full">
                        Alle Daten löschen
                      </GlassButton>
                    </div>
                  </div>
                </SettingsCard>
              </div>
            </GlassTabPanel>
          </div>

          {/* Quick Actions Footer */}
          <GlassCard variant="soft" className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-h3 mb-2 font-bold text-text-primary">Schnellaktionen</h3>
                <p className="text-label text-text-secondary">
                  Einstellungen verwalten und zurücksetzen
                </p>
              </div>
              <div className="flex gap-4">
                <GlassButton variant="ghost" size="sm">
                  Exportieren
                </GlassButton>
                <GlassButton variant="ghost" size="sm">
                  Zurücksetzen
                </GlassButton>
              </div>
            </div>
          </GlassCard>
        </div>
      </main>
      <BottomSheet
        open={isModelPickerOpen}
        onClose={() => setIsModelPickerOpen(false)}
        title="Modell auswählen"
      >
        <ModelPicker value={modelId} onChange={handleModelChange} />
      </BottomSheet>
    </div>
  );
}
