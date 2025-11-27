import { useEffect, useState } from "react";

import { Button, Input, Label, useToasts } from "@/ui";

import { useSettings } from "../../hooks/useSettings";
import {
  Book,
  Brain,
  ChevronDown,
  SlidersHorizontal,
  Smartphone,
  Sparkles,
  Zap,
} from "../../lib/icons";
import type { DiscussionPresetKey } from "../../prompts/discussion/presets";
import { discussionPresetOptions } from "../../prompts/discussion/presets";
import { SettingsLayout } from "./SettingsLayout";

const META_PRESETS = [
  {
    id: "precise",
    label: "Sachlich & Kurz",
    description: "Präzise Fakten, keine Ausschmückung.",
    icon: Zap,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    config: {
      creativity: 10,
      discussionMaxSentences: 5,
      discussionPreset: "sachlich_neutral" as DiscussionPresetKey,
      discussionStrict: true,
    },
  },
  {
    id: "creative",
    label: "Locker & Kreativ",
    description: "Unterhaltsam, ideenreich, entspannter Ton.",
    icon: Sparkles,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    config: {
      creativity: 85,
      discussionMaxSentences: 10,
      discussionPreset: "locker_neugierig" as DiscussionPresetKey,
      discussionStrict: false,
    },
  },
  {
    id: "analytical",
    label: "Analytisch",
    description: "Tiefgehend, logisch, erklärend.",
    icon: Brain,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    config: {
      creativity: 30,
      discussionMaxSentences: 10,
      discussionPreset: "analytisch_kritisch" as DiscussionPresetKey,
      discussionStrict: false,
    },
  },
  {
    id: "story",
    label: "Story & Rollenspiel",
    description: "Immersiv, ausführlich, atmosphärisch.",
    icon: Book,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    config: {
      creativity: 90,
      discussionMaxSentences: 10,
      discussionPreset: "fantasievoll_episch" as DiscussionPresetKey,
      discussionStrict: false,
    },
  },
];

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

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showAppearance, setShowAppearance] = useState(false);
  const [preferredModelInput, setPreferredModelInput] = useState(settings.preferredModelId);
  const [creativity, setCreativityState] = useState(() => settings.creativity ?? 45);

  useEffect(() => {
    setCreativityState(settings.creativity ?? 45);
  }, [settings.creativity]);

  useEffect(() => {
    setPreferredModelInput(settings.preferredModelId);
  }, [settings.preferredModelId]);

  const applyMetaPreset = (preset: (typeof META_PRESETS)[0]) => {
    setCreativity(preset.config.creativity);
    setDiscussionPreset(preset.config.discussionPreset);
    setDiscussionStrict(preset.config.discussionStrict);
    setDiscussionMaxSentences(preset.config.discussionMaxSentences);

    toasts.push({
      kind: "success",
      title: `Profil "${preset.label}" aktiviert`,
      message: "Einstellungen wurden angepasst.",
    });
  };

  const isPresetActive = (preset: (typeof META_PRESETS)[0]) => {
    // Loose comparison to check if current settings match preset roughly
    // Preset is active if key parameters match
    return (
      Math.abs(settings.creativity - preset.config.creativity) < 10 &&
      settings.discussionPreset === preset.config.discussionPreset &&
      settings.discussionStrict === preset.config.discussionStrict
    );
  };

  const handlePresetChange = (preset: DiscussionPresetKey) => {
    setDiscussionPreset(preset);
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
  };

  const handleMaxSentencesChange = (newValue: number) => {
    setDiscussionMaxSentences(newValue);
  };

  const handlePreferredModelSave = () => {
    const value = preferredModelInput.trim();
    if (!value) return;
    setPreferredModel(value);
    toasts.push({
      kind: "success",
      title: "Modell gespeichert",
      message: `Bevorzugt: ${value}`,
    });
  };

  return (
    <SettingsLayout
      activeTab="behavior"
      title="KI-Verhalten"
      description="Wähle ein Profil oder passe die KI detailliert an deine Bedürfnisse an."
    >
      <div className="space-y-6">
        {/* Meta Presets Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {META_PRESETS.map((preset) => {
            const active = isPresetActive(preset);
            const Icon = preset.icon;
            return (
              <button
                key={preset.id}
                onClick={() => applyMetaPreset(preset)}
                className={`relative flex flex-col items-start p-4 rounded-xl border-2 transition-all duration-200 text-left group ${
                  active
                    ? "border-brand bg-brand/5 shadow-brandGlow"
                    : "border-transparent bg-surface-2 hover:bg-surface-3 hover:-translate-y-0.5"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${preset.bgColor}`}
                >
                  <Icon className={`w-5 h-5 ${preset.color}`} />
                </div>
                <h3 className="font-bold text-text-primary mb-1">{preset.label}</h3>
                <p className="text-xs text-text-secondary leading-relaxed">{preset.description}</p>
                {active && (
                  <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-brand shadow-brandGlow" />
                )}
              </button>
            );
          })}
        </div>

        {/* Advanced Tuning Accordion */}
        <div className="rounded-xl bg-surface-1 border border-surface-2 overflow-hidden">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full flex items-center justify-between p-4 bg-surface-2 hover:bg-surface-3 transition-colors"
          >
            <div className="flex items-center gap-3">
              <SlidersHorizontal className="w-5 h-5 text-brand" />
              <div className="text-left">
                <h3 className="font-semibold text-text-primary">Feintuning &amp; Details</h3>
                <p className="text-xs text-text-secondary">
                  Kreativität, Antwortlänge und Prompting manuell steuern
                </p>
              </div>
            </div>
            <ChevronDown
              className={`w-5 h-5 text-text-secondary transition-transform duration-200 ${
                showAdvanced ? "rotate-180" : ""
              }`}
            />
          </button>

          {showAdvanced && (
            <div className="p-4 sm:p-6 space-y-8 bg-surface-1 animate-in slide-in-from-top-2 duration-200">
              {/* Creativity Slider */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-medium text-text-primary">Kreativität</Label>
                  <span className="text-xs font-mono bg-surface-inset px-2 py-1 rounded text-text-secondary">
                    {creativity}% ({creativityLabel})
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={creativity}
                  onChange={(e) => setCreativityValue(Number(e.target.value))}
                  className="w-full accent-brand h-2 rounded-full bg-surface-inset cursor-pointer"
                />
                <p className="text-xs text-text-muted">
                  Bestimmt die "Temperature". Höhere Werte machen die KI einfallsreicher, aber auch
                  weniger faktentreu.
                </p>
              </div>

              {/* Strict Mode Toggle */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-surface-inset border border-surface-2">
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-text-primary">
                    Strenger Modus (Sicherheit)
                  </Label>
                  <p className="text-xs text-text-muted">
                    Zusätzliche Filterung für sicherere Antworten.
                  </p>
                </div>
                <button
                  onClick={handleStrictModeToggle}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-fast ${
                    settings.discussionStrict ? "bg-brand shadow-brandGlow" : "bg-surface-2 border"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-fast ${
                      settings.discussionStrict ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Discussion Preset Grid */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-text-primary">Basis-Prompt (Stil)</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {discussionPresetOptions.map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => handlePresetChange(key)}
                      className={`px-3 py-2 rounded-md text-xs font-medium text-left border transition-all ${
                        settings.discussionPreset === key
                          ? "bg-brand/10 border-brand text-brand"
                          : "bg-surface-2 border-transparent text-text-secondary hover:bg-surface-3 hover:text-text-primary"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Max Sentences */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label className="text-sm font-medium text-text-primary">
                    Maximale Antwortlänge
                  </Label>
                  <span className="text-xs text-text-secondary">
                    {settings.discussionMaxSentences} Sätze
                  </span>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                  {[5, 8, 12, 20].map((count) => (
                    <button
                      key={count}
                      onClick={() => handleMaxSentencesChange(count)}
                      className={`px-4 py-2 rounded-md text-xs font-medium border transition-all whitespace-nowrap ${
                        settings.discussionMaxSentences === count
                          ? "bg-brand/10 border-brand text-brand"
                          : "bg-surface-2 border-transparent text-text-secondary hover:bg-surface-3"
                      }`}
                    >
                      {count === 5
                        ? "Kurz (5)"
                        : count === 8
                          ? "Standard (8)"
                          : count === 12
                            ? "Lang (12)"
                            : "Max (20)"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Model Input */}
              <div className="space-y-3 pt-4 border-t border-surface-2">
                <Label className="text-sm font-medium text-text-primary">Technisches Modell</Label>
                <div className="flex gap-2">
                  <Input
                    value={preferredModelInput}
                    onChange={(e) => setPreferredModelInput(e.target.value)}
                    placeholder="openai/gpt-4o-mini"
                    className="text-xs"
                  />
                  <Button variant="secondary" size="sm" onClick={handlePreferredModelSave}>
                    Speichern
                  </Button>
                </div>
                <p className="text-xs text-text-muted">
                  OpenRouter Modell-ID. Leere Eingabe nutzt Standard.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Appearance Accordion */}
        <div className="rounded-xl bg-surface-1 border border-surface-2 overflow-hidden">
          <button
            onClick={() => setShowAppearance(!showAppearance)}
            className="w-full flex items-center justify-between p-4 bg-surface-2 hover:bg-surface-3 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-brand" />
              <div className="text-left">
                <h3 className="font-semibold text-text-primary">Darstellung &amp; Bedienung</h3>
                <p className="text-xs text-text-secondary">Design, Schriftgröße und Animationen</p>
              </div>
            </div>
            <ChevronDown
              className={`w-5 h-5 text-text-secondary transition-transform duration-200 ${
                showAppearance ? "rotate-180" : ""
              }`}
            />
          </button>

          {showAppearance && (
            <div className="p-4 sm:p-6 space-y-6 bg-surface-1 animate-in slide-in-from-top-2 duration-200">
              {/* Theme */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-text-primary">Design-Modus</Label>
                <div className="flex p-1 rounded-lg bg-surface-inset border border-surface-2">
                  {[
                    { value: "light", label: "Hell" },
                    { value: "dark", label: "Dunkel" },
                    { value: "auto", label: "Auto" },
                  ].map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => setTheme(value as "light" | "dark" | "auto")}
                      className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                        settings.theme === value
                          ? "bg-surface-1 text-text-primary shadow-sm"
                          : "text-text-secondary hover:text-text-primary"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Size */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-text-primary">
                  Schriftgröße ({settings.fontSize}px)
                </Label>
                <input
                  type="range"
                  min={12}
                  max={24}
                  step={1}
                  value={settings.fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full accent-brand h-2 rounded-full bg-surface-inset cursor-pointer"
                />
                <div className="flex justify-between text-xs text-text-muted">
                  <span>Aa Klein</span>
                  <span>Aa Groß</span>
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-primary">Animationen reduzieren</span>
                  <button
                    onClick={() => setReduceMotion(!settings.reduceMotion)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-fast ${
                      settings.reduceMotion ? "bg-brand" : "bg-surface-inset border"
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
                  <span className="text-sm text-text-primary">Haptisches Feedback</span>
                  <button
                    onClick={() => setHapticFeedback(!settings.hapticFeedback)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-fast ${
                      settings.hapticFeedback ? "bg-brand" : "bg-surface-inset border"
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
      </div>
    </SettingsLayout>
  );
}
