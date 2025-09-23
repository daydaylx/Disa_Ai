import * as React from "react";

import { GlassButton } from "../components/glass/GlassButton";
import { GlassCard } from "../components/glass/GlassCard";
import { type GlassTab, GlassTabPanel, GlassTabs } from "../components/glass/GlassTabs";
import { RoleSettings } from "../components/settings/RoleSettings";
import { SettingsCard } from "../components/settings/SettingsCard";
import { StyleSettings } from "../components/settings/StyleSettings";
import { useToasts } from "../components/ui/Toast";
import { usePWAInstall } from "../hooks/usePWAInstall";
import { getApiKey, setApiKey } from "../services/openrouter";

export default function SettingsView() {
  const [apiKey, setApiKeyState] = React.useState(() => getApiKey() || "");
  const [keyError, setKeyError] = React.useState<string | null>(null);
  const [keySaving, setKeySaving] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("general");
  const toasts = useToasts();
  const pwa = usePWAInstall();

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
    <main
      className="mx-auto w-full max-w-6xl px-4 py-6"
      style={{ paddingBottom: "calc(var(--bottomnav-h, 56px) + 32px)" }}
    >
      {/* Control Center Header */}
      <GlassCard variant="floating" tint="cyan" className="mb-8 p-8 text-center">
        <div className="mb-4">
          <div className="text-center">
            <h1 className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-3xl font-bold text-transparent">
              Control Center
            </h1>
            <p className="text-lg text-neutral-300">Zentrale Steuerung für Disa AI</p>
          </div>
        </div>

        {/* Quick Status Cards */}
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          <GlassCard variant="soft" className="p-4 text-center">
            <div className="text-xs text-neutral-400">API Key</div>
            <div className={`text-sm font-medium ${apiKey ? "text-green-400" : "text-orange-400"}`}>
              {apiKey ? "Aktiv" : "Fehlt"}
            </div>
          </GlassCard>

          <GlassCard variant="soft" className="p-4 text-center">
            <div className="text-xs text-neutral-400">App Status</div>
            <div
              className={`text-sm font-medium ${pwa.installed ? "text-green-400" : "text-blue-400"}`}
            >
              {pwa.installed ? "Installiert" : "Browser"}
            </div>
          </GlassCard>

          <GlassCard variant="soft" className="p-4 text-center">
            <div className="text-xs text-neutral-400">Stil</div>
            <div className="text-sm font-medium text-cyan-400">Aktiv</div>
          </GlassCard>

          <GlassCard variant="soft" className="p-4 text-center">
            <div className="text-xs text-neutral-400">Rolle</div>
            <div className="text-sm font-medium text-purple-400">Konfiguriert</div>
          </GlassCard>
        </div>
      </GlassCard>

      {/* Tab Navigation */}
      <GlassCard variant="medium" className="mb-6 p-2">
        <GlassTabs
          tabs={settingsTabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
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
            <StyleSettings />
          </SettingsCard>
        </GlassTabPanel>

        {/* Roles Settings Tab */}
        <GlassTabPanel tabId="roles" activeTab={activeTab}>
          <SettingsCard
            title="KI-Rollen"
            description="Spezialisierte Rollen für verschiedene Anwendungsfälle."
            glow="purple"
          >
            <RoleSettings />
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
              icon="💾"
              glow="purple"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-white">Chat-Speicher</h4>
                    <p className="text-sm text-gray-400">Automatische Speicherung der Gespräche</p>
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
      <GlassCard variant="soft" className="mt-8 p-6">
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
  );
}
