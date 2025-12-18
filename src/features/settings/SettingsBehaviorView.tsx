import { BEHAVIOR_PRESETS } from "@/config/behavior-presets";
import { SlidersHorizontal } from "@/lib/icons";

import { AdvancedTuningPanel } from "./components/AdvancedTuningPanel";
import { MetaPresetCard } from "./components/MetaPresetCard";
import { SettingsAccordion } from "./components/SettingsAccordion";
import { useBehaviorSettings } from "./hooks/useBehaviorSettings";
import { SettingsLayout } from "./SettingsLayout";

interface SettingsBehaviorViewProps {
  activeTab?: "behavior";
}

export function SettingsBehaviorView({ activeTab = "behavior" }: SettingsBehaviorViewProps) {
  const {
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
  } = useBehaviorSettings();

  return (
    <SettingsLayout
      activeTab={activeTab}
      title="KI-Verhalten"
      description="Wähle ein Profil oder passe die KI detailliert an deine Bedürfnisse an."
    >
      <div className="space-y-6">
        {/* Meta Presets Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {BEHAVIOR_PRESETS.map((preset) => (
            <MetaPresetCard
              key={preset.id}
              preset={preset}
              isActive={isPresetActive(preset)}
              onApply={applyMetaPreset}
            />
          ))}
        </div>

        {/* Advanced Tuning Accordion */}
        <SettingsAccordion
          icon={SlidersHorizontal}
          title="Feintuning & Details"
          description="Kreativität, Antwortlänge und Prompting manuell steuern"
          isOpen={showAdvanced}
          onToggle={() => setShowAdvanced(!showAdvanced)}
        >
          <AdvancedTuningPanel
            creativity={creativity}
            discussionPreset={settings.discussionPreset}
            discussionStrict={settings.discussionStrict}
            discussionMaxSentences={settings.discussionMaxSentences}
            preferredModelInput={preferredModelInput}
            onCreativityChange={setCreativityValue}
            onPresetChange={handlePresetChange}
            onStrictModeToggle={handleStrictModeToggle}
            onMaxSentencesChange={handleMaxSentencesChange}
            onPreferredModelChange={setPreferredModelInput}
            onPreferredModelSave={handlePreferredModelSave}
          />
        </SettingsAccordion>
      </div>
    </SettingsLayout>
  );
}
