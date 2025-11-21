import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Button, Label, PremiumCard, useToasts } from "@/ui";

import {
  getFontSize,
  getHapticFeedback,
  getReduceMotion,
  setFontSize,
  setHapticFeedback,
  setReduceMotion,
} from "../../config/settings";
import { useSettings } from "../../hooks/useSettings";

export function SettingsAppearanceView() {
  const toasts = useToasts();
  const { settings, setTheme, toggleNSFWContent } = useSettings();

  // Local state for config/settings.ts values
  const [fontSize, setLocalFontSize] = useState(() => getFontSize());
  const [reduceMotion, setLocalReduceMotion] = useState(() => getReduceMotion());
  const [hapticFeedback, setLocalHapticFeedback] = useState(() => getHapticFeedback());

  // Apply font size to document when it changes
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`;
  }, [fontSize]);

  // Apply reduce motion class when it changes
  useEffect(() => {
    document.body.classList.toggle("reduce-motion", reduceMotion);
  }, [reduceMotion]);

  const handleFontSizeChange = (newSize: number) => {
    setLocalFontSize(newSize);
    setFontSize(newSize);
    toasts.push({
      kind: "success",
      title: "Schriftgröße geändert",
      message: `Neue Größe: ${newSize}px`,
    });
  };

  const handleReduceMotionToggle = () => {
    const newValue = !reduceMotion;
    setLocalReduceMotion(newValue);
    setReduceMotion(newValue);
    toasts.push({
      kind: "info",
      title: newValue ? "Animationen reduziert" : "Animationen aktiviert",
      message: newValue ? "Bewegungen werden minimiert" : "Normale Animationen aktiv",
    });
  };

  const handleHapticToggle = () => {
    const newValue = !hapticFeedback;
    setLocalHapticFeedback(newValue);
    setHapticFeedback(newValue);
    toasts.push({
      kind: "info",
      title: newValue ? "Haptisches Feedback aktiviert" : "Haptisches Feedback deaktiviert",
      message: newValue ? "Vibrationen bei Interaktionen" : "Keine Vibrationen",
    });
  };

  const handleThemeChange = (newTheme: "light" | "dark" | "auto") => {
    setTheme(newTheme);
    toasts.push({
      kind: "success",
      title: "Design geändert",
      message: `${newTheme === "auto" ? "Automatisch" : newTheme === "dark" ? "Dunkles" : "Helles"} Design aktiviert`,
    });
  };

  const handleNSFWToggle = () => {
    toggleNSFWContent();
    toasts.push({
      kind: "info",
      title: settings.showNSFWContent ? "NSFW-Inhalte aktiviert" : "NSFW-Inhalte deaktiviert",
      message: settings.showNSFWContent
        ? "Erwachseneninhalte werden angezeigt"
        : "Jugendschutz aktiv",
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
            {/* Header */}
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-text-primary">Darstellung</h2>
              <p className="text-sm text-text-secondary leading-relaxed">
                Design, Schriftgröße und Interface-Optionen anpassen
              </p>
            </div>

            {/* Theme Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-text-primary">Design-Modus</Label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: "light", label: "Hell" },
                  { value: "dark", label: "Dunkel" },
                  { value: "auto", label: "Auto" },
                ].map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => handleThemeChange(value as any)}
                    className={`p-3 rounded-md border text-sm font-medium transition-all duration-fast ${
                      settings.theme === value
                        ? "bg-brand/10 border-brand text-brand shadow-brandGlow"
                        : "bg-surface border-border text-text-secondary hover:bg-surface-hover hover:text-text-primary"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Font Size */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-text-primary">
                Schriftgröße: {fontSize}px
              </Label>
              <div className="grid grid-cols-4 gap-2">
                {[12, 16, 20, 24].map((size) => (
                  <button
                    key={size}
                    onClick={() => handleFontSizeChange(size)}
                    className={`p-2 rounded-md border text-sm font-medium transition-all duration-fast ${
                      fontSize === size
                        ? "bg-brand/10 border-brand text-brand shadow-brandGlow"
                        : "bg-surface border-border text-text-secondary hover:bg-surface-hover hover:text-text-primary"
                    }`}
                  >
                    {size}px
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-xs text-text-muted">
                <span>Klein</span>
                <span>Groß</span>
              </div>
            </div>

            {/* Motion & Accessibility */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-text-primary">Barrierefreiheit</h3>

              <div className="space-y-3">
                {/* Reduce Motion Toggle */}
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm text-text-primary">Animationen reduzieren</Label>
                    <p className="text-xs text-text-muted">
                      Minimiert Bewegungen für bessere Zugänglichkeit
                    </p>
                  </div>
                  <button
                    onClick={handleReduceMotionToggle}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-fast ${
                      reduceMotion ? "bg-brand" : "bg-surface-inset"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-fast ${
                        reduceMotion ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {/* Haptic Feedback Toggle */}
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm text-text-primary">Haptisches Feedback</Label>
                    <p className="text-xs text-text-muted">Vibrationen bei Berührungen (Mobile)</p>
                  </div>
                  <button
                    onClick={handleHapticToggle}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-fast ${
                      hapticFeedback ? "bg-brand" : "bg-surface-inset"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-fast ${
                        hapticFeedback ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Content Settings */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-text-primary">Inhaltseinstellungen</h3>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm text-text-primary">NSFW-Inhalte anzeigen</Label>
                  <p className="text-xs text-text-muted">Erwachseneninhalte nicht filtern</p>
                </div>
                <button
                  onClick={handleNSFWToggle}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-fast ${
                    settings.showNSFWContent ? "bg-brand" : "bg-surface-inset"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-fast ${
                      settings.showNSFWContent ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Preview Section */}
            <div className="rounded-md bg-surface-inset shadow-inset p-3">
              <p className="text-xs text-text-secondary leading-relaxed">
                💡 Änderungen werden sofort angewendet und automatisch gespeichert.
              </p>
            </div>
          </div>
        </PremiumCard>
      </div>
    </div>
  );
}
