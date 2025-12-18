import { useEffect, useState } from "react";

import type { BehaviorPreset } from "@/config/behavior-presets";
import { useToasts } from "@/ui";

import { useSettings } from "../../../hooks/useSettings";
import type { DiscussionPresetKey } from "../../../prompts/discussion/presets";
import { CREATIVITY_MAX, CREATIVITY_MIN, PRESET_MATCH_TOLERANCE } from "../constants";

export function useBehaviorSettings() {
  const toasts = useToasts();
  const {
    settings,
    setCreativity,
    setDiscussionPreset,
    setDiscussionStrict,
    setDiscussionMaxSentences,
    setPreferredModel,
  } = useSettings();

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [preferredModelInput, setPreferredModelInput] = useState(settings.preferredModelId);
  const [creativity, setCreativityState] = useState(() => settings.creativity ?? 45);

  useEffect(() => {
    setCreativityState(settings.creativity ?? 45);
  }, [settings.creativity]);

  useEffect(() => {
    setPreferredModelInput(settings.preferredModelId);
  }, [settings.preferredModelId]);

  const applyMetaPreset = (preset: BehaviorPreset) => {
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

  const isPresetActive = (preset: BehaviorPreset) => {
    return (
      Math.abs(settings.creativity - preset.config.creativity) < PRESET_MATCH_TOLERANCE &&
      settings.discussionPreset === preset.config.discussionPreset &&
      settings.discussionStrict === preset.config.discussionStrict
    );
  };

  const handlePresetChange = (preset: DiscussionPresetKey) => {
    setDiscussionPreset(preset);
  };

  const setCreativityValue = (value: number) => {
    const clamped = Math.min(CREATIVITY_MAX, Math.max(CREATIVITY_MIN, Math.round(value)));
    setCreativityState(clamped);
    setCreativity(clamped);
  };

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

  return {
    settings,
    showAdvanced,
    setShowAdvanced,
    preferredModelInput,
    setPreferredModelInput,
    creativity,
    applyMetaPreset,
    isPresetActive,
    handlePresetChange,
    setCreativityValue,
    handleStrictModeToggle,
    handleMaxSentencesChange,
    handlePreferredModelSave,
  };
}
