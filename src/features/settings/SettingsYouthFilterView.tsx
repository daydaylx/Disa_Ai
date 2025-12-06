import { useState } from "react";

import { Button, Input, Label, PremiumCard, useToasts } from "@/ui";

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

  const handleToggle = () => {
    if (youthProtectionEnabled) {
      // Need to verify
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
      <div className="space-y-4">
        <PremiumCard variant="default" className="max-w-2xl mx-auto">
          <div className="space-y-6 pb-4xl">
            <div className="flex items-center justify-between p-xs rounded-md border bg-surface-inset">
              <div className="space-y-1">
                <Label className="text-base font-semibold text-text-primary">
                  Jugendschutz {youthProtectionEnabled ? "AN" : "AUS"}
                </Label>
                <p className="text-xs text-text-muted">
                  {youthProtectionEnabled
                    ? "NSFW wird gefiltert. Sicher für geteilte Geräte."
                    : "NSFW wird angezeigt. Nur in privater Umgebung verwenden."}
                </p>
              </div>
              <button
                onClick={handleToggle}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-fast ${
                  youthProtectionEnabled ? "bg-brand shadow-brandGlow" : "bg-surface-inset"
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-fast ${
                    youthProtectionEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center gap-2 px-2xs py-3xs rounded-md bg-brand/10 border border-brand/20">
              <Shield className="w-4 h-4 text-brand" />
              <span className="text-sm font-medium text-brand">
                {youthProtectionEnabled ? "Jugendschutz aktiv" : "NSFW erlaubt"}
              </span>
            </div>

            <div className="rounded-md bg-surface-inset shadow-inset p-2xs space-y-1">
              <p className="text-xs font-medium text-text-primary">Hinweis</p>
              <p className="text-xs text-text-secondary leading-relaxed">
                Die Einstellung wirkt sofort auf alle neuen Antworten und wird lokal gespeichert.
                Exporte/Im- und Exporte deiner Chats bleiben unverändert.
              </p>
            </div>

            {showVerification && (
              <div className="rounded-xl border border-border-highlight/50 bg-surface-2 p-4 animate-in fade-in zoom-in-95 duration-200">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-text-primary">Altersbestätigung erforderlich</h4>
                    <p className="text-xs text-text-secondary mt-1">
                      Bitte gib dein Geburtsjahr ein, um den Jugendschutz zu deaktivieren.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="YYYY"
                      value={birthYear}
                      onChange={(e) => setBirthYear(e.target.value)}
                      className="flex-1"
                      onKeyDown={(e) => e.key === "Enter" && handleVerify()}
                    />
                    <Button onClick={handleVerify} variant="primary">
                      Bestätigen
                    </Button>
                    <Button onClick={() => setShowVerification(false)} variant="ghost">
                      Abbrechen
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </PremiumCard>
      </div>
    </SettingsLayout>
  );
}
