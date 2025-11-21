import { AppHeader, Label, PremiumCard, Switch, useToasts } from "@/ui";

import { useSettings } from "../../hooks/useSettings";
import { Shield } from "../../lib/icons";

export function SettingsFiltersView() {
  const toasts = useToasts();
  const { settings, toggleNSFWContent } = useSettings();

  const handleToggleNSFW = () => {
    toggleNSFWContent();
    toasts.push({
      kind: "success",
      title: settings.showNSFWContent ? "NSFW-Filter aktiviert" : "NSFW-Filter deaktiviert",
      message: settings.showNSFWContent
        ? "Jugendschutzfilter sind jetzt aktiv."
        : "NSFW-Inhalte werden angezeigt.",
    });
  };

  return (
    <div className="relative flex flex-col text-text-primary h-full">
      <AppHeader pageTitle="Filter" />

      <div className="space-y-4 px-4 py-4 sm:px-6">
        {/* Content Filters */}
        <PremiumCard variant="default" className="max-w-2xl mx-auto">
          <div className="space-y-6">
            {/* Header Section */}
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-brand/10 shadow-brandGlow">
                <Shield className="h-5 w-5 text-brand" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-text-primary mb-1">Inhaltsfilter</h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Steuere, welche Inhalte in Antworten und Modellbeschreibungen angezeigt werden.
                </p>
              </div>
            </div>

            {/* NSFW Toggle */}
            <div className="flex items-center justify-between py-3 px-4 rounded-md bg-surface-inset shadow-inset">
              <div className="flex-1">
                <Label className="text-base font-medium text-text-primary mb-1">
                  NSFW-Inhalte anzeigen
                </Label>
                <p className="text-sm text-text-secondary">
                  Modelle und Inhalte für Erwachsene einblenden
                </p>
              </div>
              <Switch checked={settings.showNSFWContent} onCheckedChange={handleToggleNSFW} />
            </div>

            {/* Warning Notice */}
            {settings.showNSFWContent && (
              <div className="p-4 rounded-md bg-error/10 border border-error/20">
                <p className="text-sm text-text-primary">
                  <strong>Hinweis:</strong> NSFW-Filter sind deaktiviert. Modelle können
                  unangemessene Inhalte generieren. Nur für Erwachsene geeignet.
                </p>
              </div>
            )}
          </div>
        </PremiumCard>

        {/* Safety Information */}
        <PremiumCard variant="default" className="max-w-2xl mx-auto">
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-text-primary">Sicherheit & Jugendschutz</h4>
            <ul className="text-sm text-text-secondary space-y-1 list-disc list-inside">
              <li>Filter gelten für alle Modelle und Konversationen</li>
              <li>OpenRouter bietet zusätzliche serverseitige Filterung</li>
              <li>Einige Modelle haben eingebaute Sicherheitsmechanismen</li>
              <li>Bei Problemen kann der Filter jederzeit aktiviert werden</li>
            </ul>
          </div>
        </PremiumCard>

        {/* Model Categories */}
        <PremiumCard variant="default" className="max-w-2xl mx-auto">
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-text-primary">Betroffene Modellkategorien</h4>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Bildgenerierung", filtered: true },
                { label: "Rollenspiele", filtered: true },
                { label: "Creative Writing", filtered: true },
                { label: "Standard-Chat", filtered: false },
                { label: "Code-Assistenz", filtered: false },
                { label: "Analyse", filtered: false },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-2 p-2 rounded-sm bg-surface-inset shadow-inset text-sm"
                >
                  <div
                    className={`w-2 h-2 rounded-full ${item.filtered ? "bg-error" : "bg-success"}`}
                  />
                  <span className="text-text-secondary">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </PremiumCard>
      </div>
    </div>
  );
}
