import { useEffect, useState } from "react";

import { Button, Input, Label, PremiumCard, useToasts } from "@/ui";

import { useSettings } from "../../hooks/useSettings";
import { SlidersHorizontal, Smartphone } from "../../lib/icons";
import type { DiscussionPresetKey } from "../../prompts/discussion/presets";
import { discussionPresetOptions } from "../../prompts/discussion/presets";
import { SettingsLayout } from "./SettingsLayout";

export function SettingsBehaviorView() {
  const toasts = useToasts();
  const {
    settings,
    setCreativity,
    setDiscussionPreset,
    setDiscussionStrict,
    setDiscussionMaxSentences,
    setPreferredModel,
    setTheme,
    setFontSize,
    setReduceMotion,
    setHapticFeedback,
  } = useSettings();

  const [appearanceOpen, setAppearanceOpen] = useState(true);
  const [preferredModelInput, setPreferredModelInput] = useState(settings.preferredModelId);
  const [creativity, setCreativityState] = useState(() => settings.creativity ?? 45);

  useEffect(() => {
    setCreativityState(settings.creativity ?? 45);
  }, [settings.creativity]);

  useEffect(() => {
    setPreferredModelInput(settings.preferredModelId);
  }, [settings.preferredModelId]);

  const handlePresetChange = (preset: DiscussionPresetKey) => {
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
    const newValue = !settings.discussionStrict;
    setDiscussionStrict(newValue);
    toasts.push({
      kind: "info",
      title: newValue ? "Sicherheitsmodus aktiviert" : "Sicherheitsmodus deaktiviert",
      message: newValue ? "Strengere Inhaltsfilterung aktiv" : "Normale Filterung aktiv",
    });
  };

  const handleMaxSentencesChange = (newValue: number) => {
    setDiscussionMaxSentences(newValue);
    toasts.push({
      kind: "success",
      title: "Antwortlänge geändert",
      message: `Maximal ${newValue} Sätze pro Antwort`,
    });
  };

  const handlePreferredModelSave = () => {
    const value = preferredModelInput.trim();
    if (!value) {
      toasts.push({
        kind: "error",
        title: "Modell fehlt",
        message: "Bitte eine Modell-ID wie openai/gpt-4o-mini angeben.",
      });
      return;
    }
    setPreferredModel(value);
    toasts.push({
      kind: "success",
      title: "Modell gespeichert",
      message: `Bevorzugt: ${value}`,
    });
  };

  const currentPreset = discussionPresetOptions.find(
    (opt) => opt.key === settings.discussionPreset,
  );

  return (
    <SettingsLayout
      activeTab="behavior"
      title="KI-Verhalten"
      description="Gesprächsstil, Sicherheitsniveau, Darstellung und Filter steuern."
    >
      <div className="space-y-4">
        <PremiumCard variant="default" className="max-w-3xl mx-auto">
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-text-primary">Strenger Modus</h3>
                  <p className="text-xs text-text-muted">Aktiviert zusätzliche Moderation.</p>
                </div>
                <button
                  onClick={handleStrictModeToggle}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-fast ${
                    settings.discussionStrict ? "bg-brand shadow-brandGlow" : "bg-surface-inset"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-fast ${
                      settings.discussionStrict ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
              {settings.discussionStrict && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-yellow-500/10 border border-yellow-500/20">
                  <span className="text-yellow-600 text-sm font-medium">
                    ⚠️ Strenger Modus aktiv
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-text-primary">Diskussionsstil</h3>
              <p className="text-xs text-text-muted">
                Wähle den Tonfall der Antworten. Der Stil wird mit Rollen-Prompts kombiniert.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {discussionPresetOptions.map(({ key, label }) => {
                  const active = settings.discussionPreset === key;
                  return (
                    <button
                      key={key}
                      onClick={() => handlePresetChange(key)}
                      className={`p-3 rounded-md border text-left transition-all duration-fast ${
                        active
                          ? "bg-brand/10 border-brand text-brand shadow-brandGlow"
                          : "bg-surface border-border text-text-primary hover:bg-surface-hover"
                      }`}
                    >
                      <div className="text-sm font-medium">{label}</div>
                    </button>
                  );
                })}
              </div>
              {currentPreset && (
                <div className="p-3 rounded-md bg-brand/5 border border-brand/20">
                  <Label className="text-sm font-medium text-brand">
                    Aktuell: {currentPreset.label}
                  </Label>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-text-primary">Kreativität</h3>
              <p className="text-xs text-text-muted">
                Niedrig = präzise, hoch = freier und verspielter. Wirkt sich auf Temperatur &amp;
                Top-p aus.
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

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-text-primary">Antwortlänge</h3>
              <div className="space-y-3">
                <Label className="text-sm text-text-primary">
                  Maximale Sätze pro Antwort: {settings.discussionMaxSentences}
                </Label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {[5, 6, 7, 8, 9, 10].map((count) => (
                    <button
                      key={count}
                      onClick={() => handleMaxSentencesChange(count)}
                      className={`p-2 rounded-md border text-sm font-medium transition-all duration-fast ${
                        settings.discussionMaxSentences === count
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
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-text-primary">Bevorzugtes Modell</h3>
              <p className="text-xs text-text-muted">
                Modell-ID für neue Chats. Muss zu OpenRouter passen (z. B. openai/gpt-4o-mini).
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  value={preferredModelInput}
                  onChange={(e) => setPreferredModelInput(e.target.value)}
                  placeholder="openai/gpt-4o-mini"
                  className="sm:flex-1"
                />
                <Button
                  variant="secondary"
                  onClick={handlePreferredModelSave}
                  className="sm:w-auto"
                >
                  Speichern
                </Button>
              </div>
            </div>

            <div className="space-y-3 border-t border-border pt-4">
              <button
                type="button"
                onClick={() => setAppearanceOpen((v) => !v)}
                className="flex w-full items-center justify-between rounded-md bg-surface-inset px-3 py-2 text-left"
              >
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-brand" />
                  <span className="text-sm font-semibold text-text-primary">
                    Darstellung &amp; Bedienung
                  </span>
                </div>
                <SlidersHorizontal
                  className={`w-4 h-4 text-text-secondary transition-transform ${
                    appearanceOpen ? "rotate-90" : ""
                  }`}
                />
              </button>

              {appearanceOpen && (
                <div className="space-y-4">
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
                          onClick={() => setTheme(value as "light" | "dark" | "auto")}
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

                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-text-primary">
                      Schriftgröße: {settings.fontSize}px
                    </Label>
                    <div className="grid grid-cols-4 gap-2">
                      {[12, 16, 20, 24].map((size) => (
                        <button
                          key={size}
                          onClick={() => setFontSize(size)}
                          className={`p-2 rounded-md border text-sm font-medium transition-all duration-fast ${
                            settings.fontSize === size
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

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label className="text-sm text-text-primary">Animationen reduzieren</Label>
                        <p className="text-xs text-text-muted">
                          Weniger Motion für empfindliche Augen.
                        </p>
                      </div>
                      <button
                        onClick={() => setReduceMotion(!settings.reduceMotion)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-fast ${
                          settings.reduceMotion ? "bg-brand" : "bg-surface-inset"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-fast ${
                            settings.reduceMotion ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label className="text-sm text-text-primary">Haptisches Feedback</Label>
                        <p className="text-xs text-text-muted">Vibrationen bei Buttons (mobile).</p>
                      </div>
                      <button
                        onClick={() => setHapticFeedback(!settings.hapticFeedback)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-fast ${
                          settings.hapticFeedback ? "bg-brand" : "bg-surface-inset"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-fast ${
                            settings.hapticFeedback ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-md bg-surface-inset shadow-inset p-3">
              <p className="text-xs text-text-secondary leading-relaxed">
                💡 Änderungen wirken sofort. Strenger Modus + niedrige Kreativität = sachlich und
                kurz. Höhere Kreativität + Auto-Design = freierer Stil.
              </p>
            </div>
          </div>
        </PremiumCard>
      </div>
    </SettingsLayout>
  );
}
