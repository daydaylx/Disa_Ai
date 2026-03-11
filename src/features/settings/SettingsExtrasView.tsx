import { Badge, Card, ListRow, Switch, useToasts } from "@/ui";

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
      <div className="space-y-4 pb-4xl">
        <Card
          variant="surface"
          accent="settings"
          className="mx-auto w-full max-w-2xl rounded-[26px] border-white/[0.10] bg-surface-1/82 shadow-[0_16px_38px_-30px_rgba(0,0,0,0.76)] ring-1 ring-inset ring-white/[0.04] sm:backdrop-blur-xl"
        >
          <div className="space-y-3">
            <ListRow
              title="Neko-Katze anzeigen"
              subtitle="Eine kleine 8-Bit Katze, die gelegentlich über den Bildschirm läuft, wenn du nichts tust."
              accentClassName="bg-accent-settings"
              className="rounded-[24px] border-white/[0.10] bg-black/[0.10] shadow-inner"
              leading={
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-accent-settings-border/40 bg-accent-settings-surface text-accent-settings shadow-inner">
                  <Cat className="h-6 w-6" />
                </div>
              }
              trailing={
                <Switch
                  checked={settings.enableNeko}
                  onCheckedChange={handleToggleNeko}
                  aria-label="Neko-Katze anzeigen"
                />
              }
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Badge
                  variant="settings"
                  className="min-h-[28px] rounded-full border-accent-settings/40 bg-accent-settings/20 px-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-primary"
                >
                  Deko
                </Badge>
                <p className="text-xs italic text-ink-tertiary">
                  Nur optischer Effekt. Verschwindet sofort, wenn du tippst oder scrollst.
                </p>
              </div>
            </ListRow>

            <Card
              variant="surface"
              padding="sm"
              className="rounded-[24px] border-white/[0.10] bg-black/[0.10] shadow-inner"
            >
              <div className="flex gap-3">
                <div className="mt-0.5 rounded-xl border border-accent-settings-border/35 bg-accent-settings-surface p-2 text-accent-settings shadow-inner">
                  <Cat className="h-4 w-4" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-ink-primary">Wie funktioniert das?</p>
                  <p className="text-sm leading-relaxed text-ink-secondary">
                    Die Katze erscheint auf allen Seiten (auch im Chat), wenn du länger als 5
                    Sekunden inaktiv bist. Sie taucht maximal 3x pro Sitzung auf.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </Card>
      </div>
    </SettingsLayout>
  );
}
