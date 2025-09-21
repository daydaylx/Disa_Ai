import * as React from "react";

import { GlassButton } from "../components/glass/GlassButton";
import { GlassCard } from "../components/glass/GlassCard";
import { AuroraThemeSettings } from "../components/settings/AuroraThemeSettings";
import { RoleSettings } from "../components/settings/RoleSettings";
import { SettingsCard } from "../components/settings/SettingsCard";
import SimpleThemeToggle from "../components/settings/SimpleThemeToggle";
import { StyleSettings } from "../components/settings/StyleSettings";
import Switch from "../components/Switch";
import { useToasts } from "../components/ui/Toast";
import { usePWAInstall } from "../hooks/usePWAInstall";
import { getApiKey, setApiKey } from "../services/openrouter";

export default function SettingsView() {
  const [apiKey, setApiKeyState] = React.useState(() => getApiKey() || "");
  const [keyError, setKeyError] = React.useState<string | null>(null);
  const [keySaving, setKeySaving] = React.useState(false);
  const toasts = useToasts();
  const pwa = usePWAInstall();

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
      className="mx-auto w-full max-w-6xl px-4 py-8"
      style={{ paddingBottom: "calc(var(--bottomnav-h, 56px) + 32px)" }}
    >
      {/* Header */}
      <GlassCard variant="subtle" className="mb-8 p-6 text-center">
        <h1 className="from-cyan-400 to-purple-400 mb-2 bg-gradient-to-r bg-clip-text text-2xl font-bold text-transparent">
          Einstellungen
        </h1>
        <p className="text-gray-300">API-Key, Modell-Auswahl und Personalisierung</p>
      </GlassCard>

      {/* Settings Grid */}
      <div className="lg:grid-cols-2 grid gap-6">
        {/* API Configuration */}
        <SettingsCard
          title="OpenRouter API Key"
          description="Schlüssel wird ausschließlich lokal gespeichert. Ohne Key nutzt die App Demo-Antworten."
          icon="🔑"
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
                className="border-white/20 bg-white/10 text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-cyan-400/50 w-full rounded-lg border px-4 py-3 backdrop-blur focus:outline-none focus:ring-2"
                data-testid="settings-save-key"
              />
              {keyError && <p className="text-red-400 mt-2 text-sm">{keyError}</p>}
            </div>
            <GlassButton variant="primary" onClick={handleSaveApiKey} disabled={keySaving}>
              {keySaving ? "Speichert..." : "Key speichern"}
            </GlassButton>
          </div>
        </SettingsCard>

        {/* App Installation */}
        <SettingsCard
          title="App Installation"
          description="Installiere die App für schnellen Zugriff und Offline-Unterstützung."
          icon="📱"
          glow="mint"
        >
          <div className="space-y-3">
            {pwa.canInstall ? (
              <GlassButton variant="primary" onClick={pwa.requestInstall}>
                Jetzt installieren
              </GlassButton>
            ) : pwa.installed ? (
              <div className="bg-green-500/20 text-green-400 inline-flex items-center gap-2 rounded-full px-4 py-2">
                <div className="bg-green-400 h-2 w-2 rounded-full"></div>
                Bereits installiert
              </div>
            ) : (
              <p className="text-gray-400 text-sm">
                Installations-Aufforderung momentan nicht verfügbar.
              </p>
            )}
            {pwa.showIOSHowTo && (
              <p className="text-gray-400 text-xs">
                iOS: Über „Teilen" → „Zum Home-Bildschirm" hinzufügen
              </p>
            )}
          </div>
        </SettingsCard>

        {/* Aurora Theme Settings */}
        <SettingsCard
          title="Aurora Themes"
          description="Wähle dein bevorzugtes Farbschema und passe die Performance an."
          icon="🌈"
          glow="purple"
          className="lg:col-span-2"
        >
          <AuroraThemeSettings />
        </SettingsCard>

        {/* Style Settings */}
        <SettingsCard
          title="Antwortstil"
          description="Wähle den Stil für KI-Antworten - von neutral bis kreativ."
          icon="🎯"
          glow="cyan"
          className="lg:col-span-2"
        >
          <StyleSettings />
        </SettingsCard>

        {/* Role Settings */}
        <SettingsCard
          title="KI-Rollen"
          description="Spezialisierte Rollen für verschiedene Anwendungsfälle."
          icon="👤"
          glow="purple"
          className="lg:col-span-2"
        >
          <RoleSettings />
        </SettingsCard>

        {/* Basic Theme Settings */}
        <SettingsCard
          title="Design & Thema"
          description="Grundlegende Darstellungsoptionen."
          icon="🎨"
          glow="mint"
        >
          <SimpleThemeToggle />
        </SettingsCard>

        {/* Model Selection */}
        <SettingsCard
          title="Modell-Auswahl"
          description="Wähle das AI-Modell für optimale Ergebnisse."
          icon="🤖"
          glow="warm"
        >
          <GlassButton variant="secondary" size="lg" className="w-full">
            Zur Modell-Auswahl
          </GlassButton>
        </SettingsCard>

        {/* Advanced Settings */}
        <SettingsCard
          title="Erweiterte Einstellungen"
          description="Speicher, Kontext und weitere Anpassungen."
          icon="⚙️"
          glow="none"
          className="lg:col-span-2"
        >
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium">Chat-Speicher</h4>
                  <p className="text-gray-400 text-sm">Automatische Speicherung der Gespräche</p>
                </div>
                <Switch checked={true} onChange={() => {}} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium">NSFW-Filter</h4>
                  <p className="text-gray-400 text-sm">Aktiviert Inhaltsfilterung</p>
                </div>
                <Switch checked={false} onChange={() => {}} />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-white mb-2 block text-sm font-medium">Kontext-Limit</label>
                <input
                  type="number"
                  defaultValue={4000}
                  className="border-white/20 bg-white/10 text-white focus:border-cyan-400 focus:ring-cyan-400/50 w-full rounded-lg border px-3 py-2 backdrop-blur focus:outline-none focus:ring-2"
                />
              </div>

              <div>
                <label className="text-white mb-2 block text-sm font-medium">
                  Reservierte Tokens
                </label>
                <input
                  type="number"
                  defaultValue={1000}
                  className="border-white/20 bg-white/10 text-white focus:border-cyan-400 focus:ring-cyan-400/50 w-full rounded-lg border px-3 py-2 backdrop-blur focus:outline-none focus:ring-2"
                />
              </div>
            </div>
          </div>
        </SettingsCard>
      </div>

      {/* Footer Actions */}
      <GlassCard variant="subtle" className="mt-8 p-6 text-center">
        <div className="flex flex-wrap justify-center gap-4">
          <GlassButton variant="ghost">Einstellungen exportieren</GlassButton>
          <GlassButton variant="ghost">Auf Standard zurücksetzen</GlassButton>
          <GlassButton variant="danger">Alle Daten löschen</GlassButton>
        </div>
      </GlassCard>
    </main>
  );
}
