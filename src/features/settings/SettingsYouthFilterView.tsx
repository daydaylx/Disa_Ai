import { Link } from "react-router-dom";

import { Button, Label, PremiumCard, useToasts } from "@/ui";

import { useSettings } from "../../hooks/useSettings";
import { Shield } from "../../lib/icons";

export function SettingsYouthFilterView() {
  const { settings, toggleNSFWContent } = useSettings();
  const toasts = useToasts();

  const youthProtectionEnabled = !settings.showNSFWContent;

  const confirmBirthYear = () => {
    const input = window.prompt("Bitte gib dein Geburtsjahr ein (YYYY):")?.trim();
    if (!input) {
      toasts.push({
        kind: "warning",
        title: "Abbruch",
        message: "Jugendschutz bleibt aktiv.",
      });
      return false;
    }
    const year = Number(input);
    const currentYear = new Date().getFullYear();
    const age = currentYear - year;
    if (!Number.isFinite(year) || input.length !== 4 || year < 1900 || age < 0) {
      toasts.push({
        kind: "error",
        title: "Ungültiges Jahr",
        message: "Bitte ein gültiges Geburtsjahr im Format YYYY eingeben.",
      });
      return false;
    }
    if (age < 18) {
      toasts.push({
        kind: "error",
        title: "Mindestalter 18",
        message: "Jugendschutz kann nur von volljährigen Nutzern deaktiviert werden.",
      });
      return false;
    }
    return true;
  };

  const handleToggle = () => {
    if (youthProtectionEnabled && !confirmBirthYear()) {
      return;
    }
    toggleNSFWContent();
    const newStateIsYouthOn = youthProtectionEnabled ? "aus" : "an";
    toasts.push({
      kind: youthProtectionEnabled ? "info" : "success",
      title: `Jugendschutz ${newStateIsYouthOn}`,
      message: youthProtectionEnabled
        ? "NSFW-Inhalte werden wieder angezeigt."
        : "Erwachseneninhalte werden ausgeblendet.",
    });
  };

  return (
    <div className="relative flex flex-col text-text-primary h-full">
      <div className="flex items-center gap-2 px-4 pt-4 pb-2">
        <Link to="/settings">
          <Button variant="ghost" size="sm">
            ← Zurück zu Einstellungen
          </Button>
        </Link>
      </div>

      <div className="space-y-4 px-4 py-4 sm:px-6">
        <PremiumCard variant="default" className="max-w-2xl mx-auto">
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-text-primary">Jugendfilter</h2>
              <p className="text-sm text-text-secondary leading-relaxed">
                Einfacher Schalter für NSFW-Inhalte. Jugendschutz AN blendet Erwachsenen-Content
                aus.
              </p>
            </div>

            <div className="flex items-center justify-between p-4 rounded-md border bg-surface-inset">
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

            <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-brand/10 border border-brand/20">
              <Shield className="w-4 h-4 text-brand" />
              <span className="text-sm font-medium text-brand">
                {youthProtectionEnabled ? "Jugendschutz aktiv" : "NSFW erlaubt"}
              </span>
            </div>

            <div className="rounded-md bg-surface-inset shadow-inset p-3 space-y-1">
              <p className="text-xs font-medium text-text-primary">Hinweis</p>
              <p className="text-xs text-text-secondary leading-relaxed">
                Die Einstellung wirkt sofort auf alle neuen Antworten und wird lokal gespeichert.
                Exporte/Im- und Exporte deiner Chats bleiben unverändert.
              </p>
            </div>
          </div>
        </PremiumCard>
      </div>
    </div>
  );
}
