import { useEffect } from "react";

import { Button, Input, Label, PremiumCard, PrimaryButton, useToasts } from "@/ui";

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
    // Get form data from inputs
    const nameInput = document.getElementById("memory-name") as HTMLInputElement;
    const hobbiesInput = document.getElementById("memory-hobbies") as HTMLInputElement;
    const backgroundInput = document.getElementById("memory-background") as HTMLInputElement;

    const updates = {
      name: nameInput?.value?.trim() || undefined,
      hobbies:
        hobbiesInput?.value
          ?.split(",")
          .map((h) => h.trim())
          .filter(Boolean) || undefined,
      background: backgroundInput?.value?.trim() || undefined,
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

  const showHistoryStats = isEnabled && stats;

  useEffect(() => {
    if (isEnabled) {
      void refresh();
    }
  }, [isEnabled, refresh]);

  return (
    <SettingsLayout
      activeTab="memory"
      title="Verlauf, Erinnerung & Memory"
      description="Kontextuelles Gedächtnis für personalisierte Gespräche verwalten"
    >
      <div className="space-y-4">
        <PremiumCard variant="default" className="max-w-3xl mx-auto">
          <div className="space-y-6">
            {/* Memory Toggle */}
            <div className="flex items-center justify-between p-4 rounded-md border bg-surface-inset">
              <div className="space-y-1">
                <Label className="text-base font-semibold text-text-primary">
                  Gedächtnis aktivieren
                </Label>
                <p className="text-sm text-text-muted">
                  Erlaubt der KI, sich an Details aus vergangenen Gesprächen zu erinnern
                </p>
              </div>
              <button
                onClick={handleToggleMemory}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-fast ${
                  isEnabled ? "bg-brand shadow-brandGlow" : "bg-surface-inset"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-fast ${
                    isEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Status Indicator */}
            {isEnabled && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-brand/10 border border-brand/20">
                <Shield className="w-4 h-4 text-brand" />
                <span className="text-sm font-medium text-brand">Gedächtnis ist aktiv</span>
              </div>
            )}

            {/* Profile Information - Only show when memory is enabled */}
            {isEnabled && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-text-primary">Persönliches Profil</h3>
                <p className="text-xs text-text-muted">
                  Diese Informationen helfen der KI, dich besser zu verstehen und relevantere
                  Antworten zu geben.
                </p>

                <div className="space-y-4">
                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="memory-name" className="text-sm font-medium text-text-primary">
                      Dein Name (optional)
                    </Label>
                    <Input
                      id="memory-name"
                      type="text"
                      placeholder="Wie soll die KI dich ansprechen?"
                      defaultValue={globalMemory?.name || ""}
                      disabled={!isEnabled}
                    />
                  </div>

                  {/* Hobbies */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="memory-hobbies"
                      className="text-sm font-medium text-text-primary"
                    >
                      Interessen & Hobbies (optional)
                    </Label>
                    <Input
                      id="memory-hobbies"
                      type="text"
                      placeholder="Programmierung, Musik, Sport... (kommagetrennt)"
                      defaultValue={globalMemory?.hobbies?.join(", ") || ""}
                      disabled={!isEnabled}
                    />
                  </div>

                  {/* Background */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="memory-background"
                      className="text-sm font-medium text-text-primary"
                    >
                      Hintergrund (optional)
                    </Label>
                    <Input
                      id="memory-background"
                      type="text"
                      placeholder="Beruf, Studienfach, oder andere wichtige Informationen"
                      defaultValue={globalMemory?.background || ""}
                      disabled={!isEnabled}
                    />
                  </div>

                  {/* Update Button */}
                  <PrimaryButton
                    onClick={handleUpdateProfile}
                    disabled={!isEnabled}
                    className="w-full sm:w-auto"
                  >
                    Profil speichern
                  </PrimaryButton>
                </div>
              </div>
            )}

            {/* Memory Management */}
            {isEnabled && (
              <div className="space-y-4 border-t border-border pt-4">
                <h3 className="text-sm font-semibold text-text-primary">Verlauf &amp; Kontext</h3>

                <div className="flex items-center justify-between p-3 rounded-md bg-surface-inset">
                  <div className="space-y-1">
                    <Label className="text-sm text-text-primary">
                      Letzte Unterhaltung automatisch öffnen
                    </Label>
                    <p className="text-xs text-text-muted">
                      Merkt sich die letzte Session und lädt sie beim Start.
                    </p>
                  </div>
                  <button
                    onClick={handleToggleRestore}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-fast ${
                      settings.restoreLastConversation ? "bg-brand" : "bg-surface-inset"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-fast ${
                        settings.restoreLastConversation ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {showHistoryStats && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-md bg-surface-inset flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-sm font-semibold text-text-primary">
                        <History className="w-4 h-4 text-brand" />
                        Gespräche
                      </div>
                      <div className="text-lg font-bold text-brand">
                        {stats?.totalConversations ?? 0}
                      </div>
                    </div>
                    <div className="p-3 rounded-md bg-surface-inset flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-sm font-semibold text-text-primary">
                        <Shield className="w-4 h-4 text-brand" />
                        Nachrichten
                      </div>
                      <div className="text-lg font-bold text-brand">
                        {stats?.totalMessages ?? 0}
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-4 border-t border-border pt-4">
                  <h3 className="text-sm font-semibold text-text-primary">Löschen &amp; Reset</h3>
                  <div className="space-y-3">
                    <Button
                      variant="secondary"
                      onClick={handleClearMemory}
                      className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      Alle Erinnerungen löschen
                    </Button>
                    <p className="text-xs text-text-muted">
                      ⚠️ Löscht alle gespeicherten Kontextinformationen permanent.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Privacy Notice */}
            <div className="rounded-md bg-surface-inset shadow-inset p-3">
              <div className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-brand mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <p className="text-xs font-medium text-text-primary">Datenschutz-Hinweis</p>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Alle Gedächtnisinformationen werden nur lokal im Browser gespeichert und niemals
                    an externe Server übertragen. Du kannst diese Daten jederzeit einsehen oder
                    löschen.
                  </p>
                </div>
              </div>
            </div>

            {/* Disabled State Info */}
            {!isEnabled && (
              <div className="text-center py-4">
                <p className="text-sm text-text-muted">
                  Aktiviere das Gedächtnis, um personalisierte Gespräche zu führen
                </p>
              </div>
            )}
          </div>
        </PremiumCard>
      </div>
    </SettingsLayout>
  );
}
