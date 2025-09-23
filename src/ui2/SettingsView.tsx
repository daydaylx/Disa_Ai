import * as React from "react";
import { useEffect, useState } from "react";

import { GlassButton } from "../components/glass/GlassButton";
import { GlassCard } from "../components/glass/GlassCard";
import { type GlassTab, GlassTabPanel, GlassTabs } from "../components/glass/GlassTabs";
import { SettingsCard } from "../components/settings/SettingsCard";
import { useToasts } from "../components/ui/Toast";
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

  useEffect(() => {
    const h = window.location.hash;
    const anchor = h.split("#")[2];
    if (anchor === "style") setActiveTab("style");
    if (anchor === "roles") setActiveTab("roles");
    if (anchor === "general") setActiveTab("general");
    if (anchor === "app") setActiveTab("app");
  }, []);

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
    <div className="flex h-full flex-col">
      <header className="safe-pt safe-px sticky top-0 z-10">
        <div className="glass flex items-center justify-between rounded-xl px-3 py-2 shadow-sm">
          <div>
            <div className="text-sm text-muted/80">Einstellungen</div>
            <h1 className="text-base font-semibold">Control Center</h1>
          </div>
        </div>
      </header>

      <main className="safe-px with-bottomnav flex-1 space-y-6 overflow-y-auto pt-3">
        {/* Control Center Header */}
        <GlassCard variant="floating" tint="cyan" className="p-6">
          <div className="text-center">
            <h1 className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-2xl font-bold text-transparent">
              Einstellungen
            </h1>
            <p className="mt-1 text-sm text-neutral-400">Konfiguration und Verwaltung</p>
          </div>

          {/* Status Overview */}
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="text-center">
              <div className="mb-1 text-xs font-medium uppercase tracking-wider text-neutral-400">
                API
              </div>
              <div
                className={`text-sm font-medium ${apiKey ? "text-green-400" : "text-orange-400"}`}
              >
                {apiKey ? "Verbunden" : "Nicht konfiguriert"}
              </div>
            </div>

            <div className="text-center">
              <div className="mb-1 text-xs font-medium uppercase tracking-wider text-neutral-400">
                App
              </div>
              <div
                className={`text-sm font-medium ${pwa.installed ? "text-green-400" : "text-blue-400"}`}
              >
                {pwa.installed ? "Installiert" : "Web"}
              </div>
            </div>

            <div className="text-center">
              <div className="mb-1 text-xs font-medium uppercase tracking-wider text-neutral-400">
                Stil
              </div>
              <div className="text-sm font-medium text-cyan-400">Konfiguriert</div>
            </div>

            <div className="text-center">
              <div className="mb-1 text-xs font-medium uppercase tracking-wider text-neutral-400">
                Rollen
              </div>
              <div className="text-sm font-medium text-purple-400">Verfügbar</div>
            </div>
          </div>
        </GlassCard>

        {/* Tab Navigation */}
        <GlassCard variant="medium" className="p-2">
          <GlassTabs
            tabs={settingsTabs}
            activeTab={activeTab}
            onTabChange={(tabId) => setActiveTab(tabId as TabKey)}
            fullWidth
            variant="large"
          />
        </GlassCard>

        {/* Tab Content */}
        <div className="min-h-[60vh]">
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
                      className="glass-input w-full"
                      data-testid="settings-save-key"
                    />
                    {keyError && <p className="mt-2 text-sm text-red-400">{keyError}</p>}
                  </div>
                  <GlassButton variant="primary" onClick={handleSaveApiKey} disabled={keySaving}>
                    {keySaving ? "Speichert..." : "Key speichern"}
                  </GlassButton>
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
                  <div className="glass-badge glass-badge--accent">Claude 3.5 Sonnet (Aktuell)</div>
                  <GlassButton variant="secondary" size="lg" className="w-full">
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
        <GlassCard variant="soft" className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="mb-1 font-semibold text-white">Schnellaktionen</h3>
              <p className="text-sm text-neutral-400">Einstellungen verwalten und zurücksetzen</p>
            </div>
            <div className="flex gap-3">
              <GlassButton variant="ghost" size="sm">
                Exportieren
              </GlassButton>
              <GlassButton variant="ghost" size="sm">
                Zurücksetzen
              </GlassButton>
            </div>
          </div>
        </GlassCard>
      </main>
    </div>
  );
}
