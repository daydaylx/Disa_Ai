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
import SettingsAppearance from "./settings/SettingsAppearance";
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
  const [_modelCatalog, _setModelCatalog] = useState<Awaited<ReturnType<typeof loadModelCatalog>>>(
    [],
  );

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
          <div className="glass-backdrop--strong border-glass-border-medium shadow-glass-strong hover:shadow-glass-strong flex items-center justify-between rounded-2xl px-8 py-6 transition-all duration-200">
            <div className="flex items-center gap-4">
              <div className="from-accent-teal/20 to-accent-violet/20 border-accent-teal/30 flex h-12 w-12 items-center justify-center rounded-xl border bg-gradient-to-br">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="text-accent-teal"
                >
                  <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5a3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97c0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1c0 .33.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66Z" />
                </svg>
              </div>
              <div>
                <h1 className="text-text-primary text-2xl font-bold tracking-tight">
                  Einstellungen
                </h1>
                <p className="text-text-secondary/80 text-sm">Konfiguration und Personalisierung</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div
                className={`glass-badge ${apiKey ? "glass-badge--success" : "glass-badge--warning"}`}
              >
                <div
                  className={`h-2 w-2 rounded-full ${apiKey ? "bg-green-400" : "bg-orange-400"} mr-2`}
                ></div>
                <span className="text-sm font-medium">
                  API {apiKey ? "verbunden" : "nicht konfiguriert"}
                </span>
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
          <div className="space-y-8">
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
                  </div>
                </SettingsCard>

                {/* App Info */}
                <SettingsCard
                  title="Design System"
                  description="Professionelles Glassmorphism Design mit optimaler Lesbarkeit und modernen Effekten."
                  glow="mint"
                >
                  <div className="space-y-3">
                    <div className="glass-badge glass-badge--accent">Dark Glass Theme aktiv</div>
                    <p className="text-text-muted/85 text-sm">
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
            import SettingsAppearance from "./settings/SettingsAppearance"; // ... (rest of the
            imports) // ... (rest of the component)
            {/* App Settings Tab */}
            <GlassTabPanel tabId="app" activeTab={activeTab}>
              <div className="grid gap-6 lg:grid-cols-2">
                <SettingsCard
                  title="Appearance"
                  description="Customize the look and feel of the application."
                  glow="purple"
                >
                  <SettingsAppearance />
                </SettingsCard>

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
                      <GlassButton
                        variant="ghost"
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          // Clear various caches
                          sessionStorage.clear();
                          localStorage.removeItem("disaai.history.v1");
                          toasts.push({
                            kind: "success",
                            title: "Cache geleert",
                            message: "Zwischenspeicher wurde erfolgreich geleert.",
                          });
                        }}
                      >
                        Cache leeren
                      </GlassButton>
                      <GlassButton
                        variant="danger"
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          if (
                            confirm(
                              "Alle Daten wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.",
                            )
                          ) {
                            sessionStorage.clear();
                            localStorage.clear();
                            toasts.push({
                              kind: "success",
                              title: "Daten gelöscht",
                              message: "Alle lokalen Daten wurden entfernt.",
                            });
                            window.location.reload();
                          }
                        }}
                      >
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
                <h3 className="text-h3 text-text-primary mb-2 font-bold">Schnellaktionen</h3>
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
