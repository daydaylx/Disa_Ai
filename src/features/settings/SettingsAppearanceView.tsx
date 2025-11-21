import { AppHeader, Label, PremiumCard, Select, Switch, useToasts } from "@/ui";

import { useSettings } from "../../hooks/useSettings";
import { Palette } from "../../lib/icons";

export function SettingsAppearanceView() {
  const toasts = useToasts();
  const { settings, saveSettings, toggleAnalytics, toggleNotifications } = useSettings();

  const handleThemeChange = (value: string) => {
    saveSettings({ theme: value as "light" | "dark" | "auto" });
    toasts.push({
      kind: "success",
      title: "Design aktualisiert",
      message: `Darstellung auf "${value === "auto" ? "Automatisch" : value === "dark" ? "Dunkel" : "Hell"}" gesetzt.`,
    });
  };

  const handleToggleAnalytics = () => {
    toggleAnalytics();
    toasts.push({
      kind: "success",
      title: settings.enableAnalytics ? "Analytics deaktiviert" : "Analytics aktiviert",
      message: settings.enableAnalytics
        ? "Nutzungsstatistiken werden nicht mehr erfasst."
        : "Nutzungsstatistiken helfen uns, die App zu verbessern.",
    });
  };

  const handleToggleNotifications = () => {
    toggleNotifications();
    toasts.push({
      kind: "success",
      title: settings.enableNotifications
        ? "Benachrichtigungen deaktiviert"
        : "Benachrichtigungen aktiviert",
      message: settings.enableNotifications
        ? "Du erhältst keine System-Benachrichtigungen mehr."
        : "Du wirst über wichtige Ereignisse benachrichtigt.",
    });
  };

  return (
    <div className="relative flex flex-col text-text-primary h-full">
      <AppHeader pageTitle="Darstellung" />

      <div className="space-y-4 px-4 py-4 sm:px-6">
        {/* Theme Selection */}
        <PremiumCard variant="default" className="max-w-2xl mx-auto">
          <div className="space-y-6">
            {/* Header Section */}
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-brand/10 shadow-brandGlow">
                <Palette className="h-5 w-5 text-brand" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-text-primary mb-1">Design</h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Passe das visuelle Erscheinungsbild der App an deine Vorlieben an.
                </p>
              </div>
            </div>

            {/* Theme Select */}
            <div className="space-y-3">
              <Label className="text-base font-medium text-text-primary">Farbschema</Label>
              <Select value={settings.theme} onValueChange={handleThemeChange}>
                <option value="auto">Automatisch (System)</option>
                <option value="dark">Dunkel</option>
                <option value="light">Hell</option>
              </Select>
              <p className="text-sm text-text-secondary">
                {settings.theme === "auto"
                  ? "Folgt den Systemeinstellungen deines Geräts"
                  : settings.theme === "dark"
                    ? "Immer dunkles Design für bessere Lesbarkeit bei Nacht"
                    : "Immer helles Design für maximalen Kontrast"}
              </p>
            </div>
          </div>
        </PremiumCard>

        {/* Notifications & Analytics */}
        <PremiumCard variant="default" className="max-w-2xl mx-auto">
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-text-primary">Verhalten</h3>

            {/* Notifications Toggle */}
            <div className="flex items-center justify-between py-3 px-4 rounded-md bg-surface-inset shadow-inset">
              <div className="flex-1">
                <Label className="text-base font-medium text-text-primary mb-1">
                  Benachrichtigungen
                </Label>
                <p className="text-sm text-text-secondary">
                  System-Benachrichtigungen für wichtige Ereignisse
                </p>
              </div>
              <Switch
                checked={settings.enableNotifications}
                onCheckedChange={handleToggleNotifications}
              />
            </div>

            {/* Analytics Toggle */}
            <div className="flex items-center justify-between py-3 px-4 rounded-md bg-surface-inset shadow-inset">
              <div className="flex-1">
                <Label className="text-base font-medium text-text-primary mb-1">
                  Nutzungsstatistiken
                </Label>
                <p className="text-sm text-text-secondary">
                  Anonyme Daten zur Verbesserung der App erfassen
                </p>
              </div>
              <Switch checked={settings.enableAnalytics} onCheckedChange={handleToggleAnalytics} />
            </div>
          </div>
        </PremiumCard>

        {/* Design Information */}
        <PremiumCard variant="default" className="max-w-2xl mx-auto">
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-text-primary">Design-System</h4>
            <ul className="text-sm text-text-secondary space-y-1 list-disc list-inside">
              <li>Material-inspiriertes Design mit Lila Brand-Akzent (#8b5cf6)</li>
              <li>Neumorphismus-Schatten für physische Tiefe</li>
              <li>Mobile-First Optimierung (360-414px)</li>
              <li>Signature Accent-Strip auf Premium-Cards</li>
            </ul>
          </div>
        </PremiumCard>
      </div>
    </div>
  );
}
