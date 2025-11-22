import { useState } from "react";
import { Link } from "react-router-dom";

import { Button, Label, PremiumCard, useToasts } from "@/ui";

import {
  getDiscussionMaxSentences,
  getDiscussionPreset,
  getDiscussionStrictMode,
  setDiscussionMaxSentences,
  setDiscussionPreset,
  setDiscussionStrictMode,
} from "../../config/settings";
import { useSettings } from "../../hooks/useSettings";
import type { DiscussionPresetKey } from "../../prompts/discussion/presets";
import { discussionPresetOptions } from "../../prompts/discussion/presets";

export function SettingsFiltersView() {
  const toasts = useToasts();
  const { settings, setCreativity } = useSettings();

  // Local state for discussion settings
  const [discussionPreset, setLocalDiscussionPreset] = useState(() => getDiscussionPreset());
  const [strictMode, setLocalStrictMode] = useState(() => getDiscussionStrictMode());
  const [maxSentences, setLocalMaxSentences] = useState(() => getDiscussionMaxSentences());
  const [creativity, setCreativityState] = useState(() => settings.creativity ?? 45);

  const handlePresetChange = (preset: DiscussionPresetKey) => {
    setLocalDiscussionPreset(preset);
    setDiscussionPreset(preset);
    const selectedOption = discussionPresetOptions.find((opt) => opt.key === preset);
    toasts.push({
      kind: "success",
      title: "Diskussionsstil geändert",
      message: `"${selectedOption?.label}" aktiviert`,
    });
  };

  const setCreativityValue = (value: number) => {
    const clamped = Math.min(100, Math.max(0, Math.round(value)));
    setCreativityState(clamped);
    setCreativity(clamped);
  };

  const creativityLabel = (() => {
    if (creativity <= 20) return "Präzise";
    if (creativity <= 60) return "Ausgewogen";
    return "Fantasie";
  })();

  const handleStrictModeToggle = () => {
    const newValue = !strictMode;
    setLocalStrictMode(newValue);
    setDiscussionStrictMode(newValue);
    toasts.push({
      kind: "info",
      title: newValue ? "Sicherheitsmodus aktiviert" : "Sicherheitsmodus deaktiviert",
      message: newValue ? "Strengere Inhaltsfilterung aktiv" : "Normale Filterung aktiv",
    });
  };

  const handleMaxSentencesChange = (newValue: number) => {
    setLocalMaxSentences(newValue);
    setDiscussionMaxSentences(newValue);
    toasts.push({
      kind: "success",
      title: "Antwortlänge geändert",
      message: `Maximal ${newValue} Sätze pro Antwort`,
    });
  };

  // Get current preset details
  const currentPreset = discussionPresetOptions.find((opt) => opt.key === discussionPreset);

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
              <h2 className="text-xl font-bold text-text-primary">Inhalte & Filter</h2>
              <p className="text-sm text-text-secondary leading-relaxed">
                Diskussionsstil, Sicherheitsfilter und Antwortlänge anpassen
              </p>
            </div>

            {/* Discussion Style Presets */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-text-primary">Diskussionsstil</h3>
              <p className="text-xs text-text-muted">
                Wähle den gewünschten Gesprächsstil für AI-Antworten
              </p>

              <div className="grid gap-3">
                {discussionPresetOptions.map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => handlePresetChange(key)}
                    className={`p-3 rounded-md border text-left transition-all duration-fast ${
                      discussionPreset === key
                        ? "bg-brand/10 border-brand text-brand shadow-brandGlow"
                        : "bg-surface border-border text-text-primary hover:bg-surface-hover"
                    }`}
                  >
                    <div className="text-sm font-medium">{label}</div>
                  </button>
                ))}
              </div>

              {/* Current Selection Preview */}
              {currentPreset && (
                <div className="p-3 rounded-md bg-brand/5 border border-brand/20">
                  <Label className="text-sm font-medium text-brand">
                    Aktuell: {currentPreset.label}
                  </Label>
                </div>
              )}
            </div>

            {/* Safety & Content Controls */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-text-primary">Sicherheitseinstellungen</h3>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm text-text-primary">Strenger Sicherheitsmodus</Label>
                  <p className="text-xs text-text-muted">
                    Aktiviert zusätzliche Inhaltsfilter für sensible Themen
                  </p>
                </div>
                <button
                  onClick={handleStrictModeToggle}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-fast ${
                    strictMode ? "bg-brand shadow-brandGlow" : "bg-surface-inset"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-fast ${
                      strictMode ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {strictMode && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-yellow-500/10 border border-yellow-500/20">
                  <span className="text-yellow-600 text-sm font-medium">
                    ⚠️ Strenger Modus aktiv
                  </span>
                </div>
              )}
            </div>

            {/* Creativity Slider */}
            <div className="space-y-4 border-t border-border pt-4">
              <h3 className="text-sm font-semibold text-text-primary">Kreativität</h3>
              <p className="text-xs text-text-muted">
                Niedrig = verlässlicher, hoch = kreativer aber ungenauer.
              </p>

              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between text-sm font-medium text-text-primary">
                  <span>Kreativität</span>
                  <span className="text-text-secondary">
                    {creativity} · {creativityLabel}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={creativity}
                  aria-valuetext={creativityLabel}
                  onChange={(e) => setCreativityValue(Number(e.target.value))}
                  className="w-full accent-brand h-2 rounded-full bg-surface-inset focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/70"
                />
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-surface-inset px-3 py-1 text-xs font-semibold text-text-secondary transition-colors">
                    Antwortstil: {creativityLabel}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "Präzise", value: 10 },
                    { label: "Ausgewogen", value: 45 },
                    { label: "Fantasie", value: 85 },
                  ].map((preset) => {
                    const active = creativity === preset.value;
                    return (
                      <button
                        key={preset.label}
                        onClick={() => setCreativityValue(preset.value)}
                        className={`w-full rounded-md px-3 py-2 text-sm font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/70 ${
                          active
                            ? "bg-brand text-white shadow-brandGlow"
                            : "bg-surface border border-surface-2 text-text-primary hover:bg-surface-hover"
                        }`}
                        type="button"
                        aria-pressed={active}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Response Length Control */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-text-primary">Antwortlänge</h3>

              <div className="space-y-3">
                <Label className="text-sm text-text-primary">
                  Maximale Sätze pro Antwort: {maxSentences}
                </Label>
                <div className="grid grid-cols-6 gap-2">
                  {[5, 6, 7, 8, 9, 10].map((count) => (
                    <button
                      key={count}
                      onClick={() => handleMaxSentencesChange(count)}
                      className={`p-2 rounded-md border text-sm font-medium transition-all duration-fast ${
                        maxSentences === count
                          ? "bg-brand/10 border-brand text-brand shadow-brandGlow"
                          : "bg-surface border-border text-text-secondary hover:bg-surface-hover hover:text-text-primary"
                      }`}
                    >
                      {count}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-text-muted">
                  <span>Kurz (5 Sätze)</span>
                  <span>Ausführlich (10 Sätze)</span>
                </div>
              </div>

              <p className="text-xs text-text-muted">
                Begrenzt die Länge der AI-Antworten für präzisere oder ausführlichere Gespräche
              </p>
            </div>

            {/* Advanced Filters Section */}
            <div className="space-y-4 border-t border-border pt-4">
              <h3 className="text-sm font-semibold text-text-primary">Erweiterte Filter</h3>

              <div className="space-y-3">
                <div className="p-3 rounded-md bg-surface-inset">
                  <div className="text-sm font-medium text-text-primary mb-1">
                    Automatische Inhaltsfilterung
                  </div>
                  <p className="text-xs text-text-muted">
                    Grundlegende Sicherheitsfilter sind immer aktiv und können nicht deaktiviert
                    werden. Der strenge Modus fügt zusätzliche Filter für sensible Bereiche hinzu.
                  </p>
                </div>

                <div className="p-3 rounded-md bg-surface-inset">
                  <div className="text-sm font-medium text-text-primary mb-1">Jugendschutz</div>
                  <p className="text-xs text-text-muted">
                    Altersgerechte Inhalte werden automatisch angepasst. NSFW-Inhalte können in den
                    Darstellungseinstellungen verwaltet werden.
                  </p>
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="rounded-md bg-surface-inset shadow-inset p-3">
              <p className="text-xs text-text-secondary leading-relaxed">
                💡 Diese Einstellungen beeinflussen den Stil und die Sicherheit der AI-Antworten.
                Änderungen werden sofort für neue Gespräche angewendet.
              </p>
            </div>
          </div>
        </PremiumCard>
      </div>
    </div>
  );
}
