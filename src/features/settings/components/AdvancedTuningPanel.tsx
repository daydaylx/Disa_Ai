import { DEFAULT_MODEL_ID } from "@/config/modelPresets";
import type { DiscussionPresetKey } from "@/prompts/discussion/presets";
import { discussionPresetOptions } from "@/prompts/discussion/presets";
import { Button, Input, Label } from "@/ui";

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
    <div className="p-4 sm:p-6 space-y-8 bg-surface-1 animate-in slide-in-from-top-2 duration-200">
      {/* Creativity Slider */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label className="text-sm font-medium text-text-primary">Kreativität</Label>
          <span className="text-xs font-mono bg-surface-inset px-3xs py-3xs rounded text-text-secondary">
            {creativity}% ({getCreativityLabel()})
          </span>
        </div>
        <input
          type="range"
          min={CREATIVITY_MIN}
          max={CREATIVITY_MAX}
          value={creativity}
          onChange={(e) => onCreativityChange(Number(e.target.value))}
          className="w-full accent-brand h-2 rounded-full bg-surface-inset cursor-pointer"
        />
        <p className="text-xs text-text-muted">
          Bestimmt die "Temperature". Höhere Werte machen die KI einfallsreicher, aber auch weniger
          faktentreu.
        </p>
      </div>

      {/* Strict Mode Toggle */}
      <div className="flex items-center justify-between p-3 rounded-lg bg-surface-inset border border-surface-2">
        <div className="space-y-1">
          <Label className="text-sm font-medium text-text-primary">
            Strenger Modus (Sicherheit)
          </Label>
          <p className="text-xs text-text-muted">Zusätzliche Filterung für sicherere Antworten.</p>
        </div>
        <button
          onClick={onStrictModeToggle}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-fast ${
            discussionStrict ? "bg-brand shadow-brandGlow" : "bg-surface-2 border"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-fast ${
              discussionStrict ? "translate-x-6" : "translate-x-1"
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
              onClick={() => onPresetChange(key)}
              className={`px-2xs py-3xs rounded-md text-xs font-medium text-left border transition-all ${
                discussionPreset === key
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
          <Label className="text-sm font-medium text-text-primary">Maximale Antwortlänge</Label>
          <span className="text-xs text-text-secondary">{discussionMaxSentences} Sätze</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {MAX_SENTENCES_OPTIONS.map((count) => (
            <button
              key={count}
              onClick={() => onMaxSentencesChange(count)}
              className={`px-xs py-3xs rounded-md text-xs font-medium border transition-all whitespace-nowrap ${
                discussionMaxSentences === count
                  ? "bg-brand/10 border-brand text-brand"
                  : "bg-surface-2 border-transparent text-text-secondary hover:bg-surface-3"
              }`}
            >
              {MAX_SENTENCES_LABELS[count]}
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
            onChange={(e) => onPreferredModelChange(e.target.value)}
            placeholder={DEFAULT_MODEL_ID}
            className="text-xs"
          />
          <Button variant="secondary" size="sm" onClick={onPreferredModelSave}>
            Speichern
          </Button>
        </div>
        <p className="text-xs text-text-muted">
          OpenRouter Modell-ID. Leere Eingabe nutzt Standard.
        </p>
      </div>
    </div>
  );
}
