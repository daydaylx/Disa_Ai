import { Label, PremiumCard, useToasts } from "@/ui";

import { useSettings } from "../../hooks/useSettings";
import { Cat } from "../../lib/icons";
import { SettingsLayout } from "./SettingsLayout";

export function SettingsExtrasView() {
  const toasts = useToasts();
  const { settings, toggleNeko } = useSettings();

  const handleToggleNeko = () => {
    toggleNeko();
    toasts.push({
      kind: settings.enableNeko ? "info" : "success",
      title: settings.enableNeko ? "Katze deaktiviert" : "Katze aktiviert",
      message: settings.enableNeko
        ? "Die kleine Neko-Katze wird nicht mehr erscheinen."
        : "Miau! Die Katze erscheint nun gelegentlich, wenn du inaktiv bist.",
    });
  };

  return (
    <SettingsLayout
      activeTab="extras"
      title="Extras & Spielereien"
      description="Optionale Funktionen und Easter-Eggs, die keinen Einfluss auf die Kernfunktionen haben."
    >
      <div className="space-y-4">
        <PremiumCard variant="default" className="max-w-2xl mx-auto">
          <div className="space-y-6">
            {/* Neko Toggle */}
            <div className="flex items-center justify-between p-4 rounded-md border bg-surface-inset">
              <div className="space-y-1 flex-1 mr-4">
                <div className="flex items-center gap-2">
                  <Label className="text-base font-semibold text-text-primary">
                    Neko-Katze anzeigen
                  </Label>
                  {/* Small decorative badge */}
                  <span className="px-3xs py-3xs rounded text-[10px] font-bold bg-purple-500/10 text-purple-600 uppercase tracking-wider">
                    Deko
                  </span>
                </div>
                <p className="text-sm text-text-muted">
                  Eine kleine 8-Bit Katze, die gelegentlich über den Bildschirm läuft, wenn du
                  nichts tust.
                </p>
                <p className="text-xs text-text-tertiary italic mt-1">
                  Nur optischer Effekt. Verschwindet sofort, wenn du tippst oder scrollst.
                </p>
              </div>

              <button
                onClick={handleToggleNeko}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-fast flex-shrink-0 ${
                  settings.enableNeko
                    ? "bg-brand shadow-brandGlow"
                    : "bg-surface-inset border border-surface-2"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-fast ${
                    settings.enableNeko ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Info Box */}
            <div className="rounded-md bg-surface-inset shadow-inset p-4 flex gap-3">
              <div className="mt-1 text-text-secondary">
                <Cat className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-text-primary">Wie funktioniert das?</p>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Die Katze erscheint auf allen Seiten (auch im Chat), wenn du länger als 5 Sekunden
                  inaktiv bist. Sie taucht maximal 3x pro Sitzung auf.
                </p>
              </div>
            </div>
          </div>
        </PremiumCard>
      </div>
    </SettingsLayout>
  );
}
