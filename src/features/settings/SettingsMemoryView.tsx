import { useEffect, useState } from "react";

import { Button, InfoBanner, useToasts } from "@/ui";
import { SettingsRow, SettingsSection, SettingsToggleRow } from "@/ui/SettingsRow";

import { useConversationStats } from "../../hooks/use-storage";
import { useMemory } from "../../hooks/useMemory";
import { useSettings } from "../../hooks/useSettings";
import { History, Shield, Trash2 } from "../../lib/icons";
import { SettingsLayout } from "./SettingsLayout";

export function SettingsMemoryView() {
  const toasts = useToasts();
  const { isEnabled, globalMemory, toggleMemory, updateGlobalMemory, clearAllMemory } = useMemory();
  const { settings, toggleRestoreLastConversation } = useSettings();
  const { stats, refresh } = useConversationStats();

  // Local form state
  const [name, setName] = useState(globalMemory?.name || "");
  const [hobbies, setHobbies] = useState(globalMemory?.hobbies?.join(", ") || "");
  const [background, setBackground] = useState(globalMemory?.background || "");

  useEffect(() => {
    setName(globalMemory?.name || "");
    setHobbies(globalMemory?.hobbies?.join(", ") || "");
    setBackground(globalMemory?.background || "");
  }, [globalMemory]);

  const handleToggleMemory = () => {
    toggleMemory();
    toasts.push({
      kind: "info",
      title: isEnabled ? "Gedächtnis deaktiviert" : "Gedächtnis aktiviert",
      message: isEnabled
        ? "Vergangene Gespräche werden nicht mehr gespeichert"
        : "Zukünftige Gespräche werden für Kontext gespeichert",
    });
  };

  const handleUpdateProfile = () => {
    const updates = {
      name: name.trim() || undefined,
      hobbies:
        hobbies
          .split(",")
          .map((h) => h.trim())
          .filter(Boolean) || undefined,
      background: background.trim() || undefined,
    };

    updateGlobalMemory(updates);
    toasts.push({
      kind: "success",
      title: "Profil aktualisiert",
      message: "Deine Informationen wurden gespeichert",
    });
  };

  const handleClearMemory = () => {
    if (
      confirm(
        "Wirklich alle gespeicherten Erinnerungen löschen? Diese Aktion kann nicht rückgängig gemacht werden.",
      )
    ) {
      clearAllMemory();
      toasts.push({
        kind: "warning",
        title: "Gedächtnis gelöscht",
        message: "Alle gespeicherten Informationen wurden entfernt",
      });
    }
  };

  const handleToggleRestore = () => {
    if (!isEnabled) {
      toasts.push({
        kind: "warning",
        title: "Gedächtnis aus",
        message: "Aktiviere das Gedächtnis, um den Verlauf automatisch zu laden.",
      });
      return;
    }
    toggleRestoreLastConversation();
  };

  useEffect(() => {
    if (isEnabled) {
      void refresh();
    }
  }, [isEnabled, refresh]);

  return (
    <SettingsLayout
      activeTab="memory"
      title="Gedächtnis"
      description="Verlauf und persönliche Informationen verwalten"
    >
      <div className="space-y-6">
        {/* Memory Toggle Section */}
        <SettingsSection title="Gedächtnis">
          <SettingsToggleRow
            label="Gedächtnis aktivieren"
            description="Erlaubt der KI, sich an Details aus vergangenen Gesprächen zu erinnern"
            checked={isEnabled}
            onCheckedChange={handleToggleMemory}
          />
        </SettingsSection>

        {/* Profile Section - Only when enabled */}
        {isEnabled && (
          <SettingsSection
            title="Persönliches Profil"
            description="Diese Informationen helfen der KI, dich besser zu verstehen"
          >
            <SettingsRow label="Dein Name" description="Wie soll die KI dich ansprechen?">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Optional"
                className="w-full sm:w-40 h-11 px-2xs text-sm bg-surface-2 border border-white/5 rounded-lg text-ink-primary placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-accent-settings/30 focus:border-accent-settings/40"
              />
            </SettingsRow>

            <SettingsRow label="Interessen" description="Hobbies, kommagetrennt">
              <input
                type="text"
                value={hobbies}
                onChange={(e) => setHobbies(e.target.value)}
                placeholder="z.B. Musik, Sport"
                className="w-full sm:w-40 h-11 px-2xs text-sm bg-surface-2 border border-white/5 rounded-lg text-ink-primary placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-accent-settings/30 focus:border-accent-settings/40"
              />
            </SettingsRow>

            <SettingsRow label="Hintergrund" description="Beruf oder Studienfach">
              <input
                type="text"
                value={background}
                onChange={(e) => setBackground(e.target.value)}
                placeholder="Optional"
                className="w-full sm:w-40 h-11 px-2xs text-sm bg-surface-2 border border-white/5 rounded-lg text-ink-primary placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-accent-settings/30 focus:border-accent-settings/40"
              />
            </SettingsRow>

            <div className="py-4">
              <Button variant="primary" size="sm" onClick={handleUpdateProfile}>
                Profil speichern
              </Button>
            </div>
          </SettingsSection>
        )}

        {/* History Section */}
        {isEnabled && (
          <SettingsSection title="Verlauf">
            <SettingsToggleRow
              label="Letzte Unterhaltung laden"
              description="Beim Start die letzte Session automatisch öffnen"
              checked={settings.restoreLastConversation}
              onCheckedChange={handleToggleRestore}
            />

            {stats && (
              <div className="py-4 flex gap-6">
                <div className="flex items-center gap-2">
                  <History className="h-4 w-4 text-accent-settings" />
                  <span className="text-sm text-ink-primary font-medium">
                    {stats.totalConversations ?? 0}
                  </span>
                  <span className="text-xs text-ink-tertiary">Gespräche</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-accent-settings" />
                  <span className="text-sm text-ink-primary font-medium">
                    {stats.totalMessages ?? 0}
                  </span>
                  <span className="text-xs text-ink-tertiary">Nachrichten</span>
                </div>
              </div>
            )}
          </SettingsSection>
        )}

        {/* Danger Zone */}
        {isEnabled && (
          <SettingsSection title="Daten löschen">
            <div className="py-4 space-y-3">
              <Button variant="destructive" size="sm" onClick={handleClearMemory} className="gap-2">
                <Trash2 className="h-4 w-4" />
                Alle Erinnerungen löschen
              </Button>
              <p className="text-xs text-ink-tertiary">
                Löscht alle gespeicherten Kontextinformationen permanent.
              </p>
            </div>
          </SettingsSection>
        )}

        {/* Privacy Notice */}
        <InfoBanner icon={<Shield className="h-4 w-4" />} title="Datenschutz">
          Alle Gedächtnisinformationen werden nur lokal im Browser gespeichert und niemals an
          externe Server übertragen. Du kannst diese Daten jederzeit einsehen oder löschen.
        </InfoBanner>

        {/* Disabled State */}
        {!isEnabled && (
          <div className="text-center py-8">
            <p className="text-sm text-ink-tertiary">
              Aktiviere das Gedächtnis, um personalisierte Gespräche zu führen.
            </p>
          </div>
        )}
      </div>
    </SettingsLayout>
  );
}
