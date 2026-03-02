import { DEFAULT_MODEL_ID } from "@/config/modelPresets";
import type { DiscussionPresetKey } from "@/prompts/discussion/presets";
import { discussionPresetOptions } from "@/prompts/discussion/presets";
import { Button, Input, Label, Switch } from "@/ui";

import {
  CREATIVITY_LABELS,
  CREATIVITY_MAX,
  CREATIVITY_MIN,
  CREATIVITY_THRESHOLD_BALANCED,
  CREATIVITY_THRESHOLD_PRECISE,
  MAX_SENTENCES_LABELS,
  MAX_SENTENCES_OPTIONS,
} from "../constants";

interface AdvancedTuningPanelProps {
  creativity: number;
  discussionPreset: DiscussionPresetKey;
  discussionStrict: boolean;
  discussionMaxSentences: number;
  preferredModelInput: string;
  onCreativityChange: (value: number) => void;
  onPresetChange: (preset: DiscussionPresetKey) => void;
  onStrictModeToggle: () => void;
  onMaxSentencesChange: (count: number) => void;
  onPreferredModelChange: (value: string) => void;
  onPreferredModelSave: () => void;
}

export function AdvancedTuningPanel({
  creativity,
  discussionPreset,
  discussionStrict,
  discussionMaxSentences,
  preferredModelInput,
  onCreativityChange,
  onPresetChange,
  onStrictModeToggle,
  onMaxSentencesChange,
  onPreferredModelChange,
  onPreferredModelSave,
}: AdvancedTuningPanelProps) {
  const getCreativityLabel = () => {
    if (creativity <= CREATIVITY_THRESHOLD_PRECISE) return CREATIVITY_LABELS.PRECISE;
    if (creativity <= CREATIVITY_THRESHOLD_BALANCED) return CREATIVITY_LABELS.BALANCED;
    return CREATIVITY_LABELS.CREATIVE;
  };

  return (
    <div className="p-4 sm:p-6 space-y-8 bg-transparent animate-in slide-in-from-top-2 duration-200">
      {/* Creativity Slider */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label className="text-sm font-medium text-ink-primary">Kreativität</Label>
          <span className="text-xs font-mono bg-surface-2/50 px-3xs py-3xs rounded text-ink-secondary">
            {creativity}% ({getCreativityLabel()})
          </span>
        </div>
        <input
          type="range"
          min={CREATIVITY_MIN}
          max={CREATIVITY_MAX}
          value={creativity}
          onChange={(e) => onCreativityChange(Number(e.target.value))}
          className="w-full accent-accent-settings h-2 rounded-full bg-surface-2/50 cursor-pointer"
        />
        <p className="text-xs text-ink-muted">
          Bestimmt die "Temperature". Höhere Werte machen die KI einfallsreicher, aber auch weniger
          faktentreu.
        </p>
      </div>

      {/* Strict Mode Toggle */}
      <div className="flex items-center justify-between p-3 rounded-lg bg-surface-2/35 border border-white/[0.08]">
        <div className="space-y-1">
          <Label className="text-sm font-medium text-ink-primary">
            Strenger Modus (Sicherheit)
          </Label>
          <p className="text-xs text-ink-muted">Zusätzliche Filterung für sicherere Antworten.</p>
        </div>
        <Switch checked={discussionStrict} onCheckedChange={onStrictModeToggle} />
      </div>

      {/* Discussion Preset Grid */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-ink-primary">Basis-Prompt (Stil)</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {discussionPresetOptions.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => onPresetChange(key)}
              className={`px-2xs py-3xs rounded-md text-xs font-medium text-left border transition-all ${
                discussionPreset === key
                  ? "bg-accent-settings-dim/40 border-accent-settings-border text-accent-settings"
                  : "bg-surface-card border-transparent text-ink-secondary hover:bg-surface-2/80 hover:text-ink-primary"
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
          <Label className="text-sm font-medium text-ink-primary">Maximale Antwortlänge</Label>
          <span className="text-xs text-ink-secondary">{discussionMaxSentences} Sätze</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {MAX_SENTENCES_OPTIONS.map((count) => (
            <button
              key={count}
              onClick={() => onMaxSentencesChange(count)}
              className={`px-xs py-3xs rounded-md text-xs font-medium border transition-all whitespace-nowrap ${
                discussionMaxSentences === count
                  ? "bg-accent-settings-dim/40 border-accent-settings-border text-accent-settings"
                  : "bg-surface-card border-transparent text-ink-secondary hover:bg-surface-2/80"
              }`}
            >
              {MAX_SENTENCES_LABELS[count]}
            </button>
          ))}
        </div>
      </div>

      {/* Model Input */}
      <div className="space-y-3 pt-4 border-t border-white/[0.08]">
        <Label className="text-sm font-medium text-ink-primary">Technisches Modell</Label>
        <div className="flex gap-2">
          <Input
            value={preferredModelInput}
            onChange={(e) => onPreferredModelChange(e.target.value)}
            placeholder={DEFAULT_MODEL_ID}
            className="text-xs"
          />
          <Button variant="secondary" size="sm" onClick={onPreferredModelSave}>
            Speichern
          </Button>
        </div>
        <p className="text-xs text-ink-muted">
          OpenRouter Modell-ID. Leere Eingabe nutzt Standard.
        </p>
      </div>
    </div>
  );
}
