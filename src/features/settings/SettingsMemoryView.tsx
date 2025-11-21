import { useState } from "react";

import { AppHeader, Button, Label, PremiumCard, PrimaryButton, Switch, useToasts } from "@/ui";

import { useMemory } from "../../hooks/useMemory";
import { BookOpenCheck, Trash2 } from "../../lib/icons";

export function SettingsMemoryView() {
  const toasts = useToasts();
  const { isEnabled, globalMemory, toggleMemory, clearAllMemory } = useMemory();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleToggleMemory = () => {
    toggleMemory();
    toasts.push({
      kind: "success",
      title: isEnabled ? "Gedächtnis deaktiviert" : "Gedächtnis aktiviert",
      message: isEnabled
        ? "Disa wird keine neuen Informationen mehr merken."
        : "Disa kann sich jetzt Details über dich merken.",
    });
  };

  const handleClearMemory = () => {
    clearAllMemory();
    setShowClearConfirm(false);
    toasts.push({
      kind: "success",
      title: "Gedächtnis gelöscht",
      message: "Alle gespeicherten Informationen wurden entfernt.",
    });
  };

  return (
    <div className="relative flex flex-col text-text-primary h-full">
      <AppHeader pageTitle="Gedächtnis" />

      <div className="space-y-4 px-4 py-4 sm:px-6">
        {/* Main Memory Control */}
        <PremiumCard variant="default" className="max-w-2xl mx-auto">
          <div className="space-y-6">
            {/* Header Section */}
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-brand/10 shadow-brandGlow">
                <BookOpenCheck className="h-5 w-5 text-brand" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-text-primary mb-1">Lokales Gedächtnis</h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Disa kann sich Details über dich merken, um zukünftige Antworten personalisieren
                  zu können. Alle Daten bleiben lokal auf deinem Gerät.
                </p>
              </div>
            </div>

            {/* Memory Toggle */}
            <div className="flex items-center justify-between py-3 px-4 rounded-md bg-surface-inset shadow-inset">
              <div className="flex-1">
                <Label className="text-base font-medium text-text-primary mb-1">
                  Gedächtnis aktivieren
                </Label>
                <p className="text-sm text-text-secondary">
                  Informationen aus Gesprächen speichern
                </p>
              </div>
              <Switch checked={isEnabled} onCheckedChange={handleToggleMemory} />
            </div>

            {/* Current Memory Status */}
            {isEnabled && globalMemory && (
              <div className="space-y-3 mt-4">
                <h4 className="text-sm font-semibold text-text-primary">
                  Gespeicherte Informationen:
                </h4>
                <div className="space-y-2">
                  {globalMemory.name && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-text-secondary">Name:</span>
                      <span className="text-text-primary font-medium">{globalMemory.name}</span>
                    </div>
                  )}
                  {globalMemory.hobbies && globalMemory.hobbies.length > 0 && (
                    <div className="flex items-start gap-2 text-sm">
                      <span className="text-text-secondary">Hobbys:</span>
                      <span className="text-text-primary">{globalMemory.hobbies.join(", ")}</span>
                    </div>
                  )}
                  {globalMemory.background && (
                    <div className="flex items-start gap-2 text-sm">
                      <span className="text-text-secondary">Hintergrund:</span>
                      <span className="text-text-primary">{globalMemory.background}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Clear Memory Section */}
            {isEnabled && (
              <div className="pt-4 border-t border-surface-inset">
                {!showClearConfirm ? (
                  <Button
                    variant="secondary"
                    onClick={() => setShowClearConfirm(true)}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Gedächtnis löschen
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-text-secondary text-center">
                      Möchtest du wirklich alle gespeicherten Informationen löschen?
                    </p>
                    <div className="flex gap-3">
                      <Button
                        variant="secondary"
                        onClick={() => setShowClearConfirm(false)}
                        className="flex-1"
                      >
                        Abbrechen
                      </Button>
                      <PrimaryButton
                        onClick={handleClearMemory}
                        className="flex-1 bg-error hover:bg-error"
                      >
                        Jetzt löschen
                      </PrimaryButton>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </PremiumCard>

        {/* Privacy Notice */}
        <PremiumCard variant="default" className="max-w-2xl mx-auto">
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-text-primary">Datenschutz & Speicherung</h4>
            <ul className="text-sm text-text-secondary space-y-1 list-disc list-inside">
              <li>Alle Daten bleiben lokal im Browser (IndexedDB/LocalStorage)</li>
              <li>Keine Übertragung an externe Server</li>
              <li>Jederzeit löschbar ohne Rückstände</li>
              <li>Nur für personalisierte Antworten verwendet</li>
            </ul>
          </div>
        </PremiumCard>
      </div>
    </div>
  );
}
