import { useState } from "react";

import { Button, Card, Input, ListRow, Switch, useToasts } from "@/ui";

import { useSettings } from "../../hooks/useSettings";
import { Shield } from "../../lib/icons";
import { SettingsLayout } from "./SettingsLayout";

export function SettingsYouthFilterView() {
  const { settings, toggleNSFWContent } = useSettings();
  const toasts = useToasts();
  const [showVerification, setShowVerification] = useState(false);
  const [birthYear, setBirthYear] = useState("");

  const youthProtectionEnabled = !settings.showNSFWContent;

  const handleVerify = () => {
    const year = Number(birthYear.trim());
    const currentYear = new Date().getFullYear();
    const age = currentYear - year;

    if (!birthYear || !Number.isFinite(year) || birthYear.length !== 4 || year < 1900 || age < 0) {
      toasts.push({
        kind: "error",
        title: "Ungültiges Jahr",
        message: "Bitte ein gültiges Geburtsjahr im Format YYYY eingeben.",
      });
      return;
    }

    if (age < 18) {
      toasts.push({
        kind: "error",
        title: "Mindestalter 18",
        message: "Jugendschutz kann nur von volljährigen Nutzern deaktiviert werden.",
      });
      setShowVerification(false);
      setBirthYear("");
      return;
    }

    // Success
    toggleNSFWContent();
    toasts.push({
      kind: "info",
      title: "Jugendschutz aus",
      message: "NSFW-Inhalte werden wieder angezeigt.",
    });
    setShowVerification(false);
    setBirthYear("");
  };

  const handleToggle = (checked: boolean) => {
    if (checked === youthProtectionEnabled) return;

    if (!checked) {
      // Need to verify before disabling youth protection
      setShowVerification(true);
    } else {
      // Enable directly
      toggleNSFWContent();
      toasts.push({
        kind: "success",
        title: "Jugendschutz an",
        message: "Erwachseneninhalte werden ausgeblendet.",
      });
    }
  };

  return (
    <SettingsLayout
      activeTab="youth"
      title="Jugendfilter"
      description="Einfacher Schalter für NSFW-Inhalte. Jugendschutz AN blendet Erwachsenen-Content aus."
    >
      <div className="space-y-4 pb-4xl">
        <Card variant="surface" accent="settings" className="mx-auto w-full max-w-2xl">
          <div className="space-y-3">
            <ListRow
              title={`Jugendschutz ${youthProtectionEnabled ? "AN" : "AUS"}`}
              subtitle={
                youthProtectionEnabled
                  ? "NSFW wird gefiltert. Sicher für geteilte Geräte."
                  : "NSFW wird angezeigt. Nur in privater Umgebung verwenden."
              }
              accentClassName="bg-accent-settings"
              className="border-white/[0.08] bg-surface-2/35"
              leading={
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-settings-surface text-accent-settings">
                  <Shield className="h-6 w-6" />
                </div>
              }
              trailing={
                <Switch
                  checked={youthProtectionEnabled}
                  onCheckedChange={handleToggle}
                  aria-label="Jugendschutz umschalten"
                />
              }
            />

            <div className="flex items-center gap-2 rounded-xl border border-accent-settings-border/35 bg-accent-settings-dim/30 px-3 py-2.5">
              <Shield className="h-4 w-4 text-accent-settings" />
              <span className="text-sm font-medium text-ink-primary">
                {youthProtectionEnabled ? "Jugendschutz aktiv" : "NSFW erlaubt"}
              </span>
            </div>

            <Card variant="surface" padding="sm" className="border-white/[0.08] bg-surface-2/35">
              <p className="text-xs font-medium text-ink-primary">Hinweis</p>
              <p className="mt-1 text-xs leading-relaxed text-ink-secondary">
                Die Einstellung wirkt sofort auf alle neuen Antworten und wird lokal gespeichert.
                Exporte und Importe deiner Chats bleiben unverändert.
              </p>
            </Card>

            {showVerification && (
              <Card
                variant="surface"
                padding="sm"
                className="animate-in fade-in zoom-in-95 duration-200 border-accent-settings-border/45 bg-accent-settings-dim/25"
              >
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-ink-primary">
                      Altersbestätigung erforderlich
                    </h4>
                    <p className="mt-1 text-xs text-ink-secondary">
                      Bitte gib dein Geburtsjahr ein, um den Jugendschutz zu deaktivieren.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Input
                      type="number"
                      inputMode="numeric"
                      placeholder="YYYY"
                      value={birthYear}
                      onChange={(e) => setBirthYear(e.target.value)}
                      className="flex-1"
                      onKeyDown={(e) => e.key === "Enter" && handleVerify()}
                    />
                    <Button onClick={handleVerify} variant="primary" className="w-full sm:w-auto">
                      Bestätigen
                    </Button>
                    <Button
                      onClick={() => setShowVerification(false)}
                      variant="ghost"
                      className="w-full sm:w-auto"
                    >
                      Abbrechen
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </Card>
      </div>
    </SettingsLayout>
  );
}
