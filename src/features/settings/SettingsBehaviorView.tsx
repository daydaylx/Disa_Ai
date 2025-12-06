import { useEffect } from "react";

import { BEHAVIOR_PRESETS } from "@/config/behavior-presets";
import { SlidersHorizontal, Smartphone } from "@/lib/icons";

import { AdvancedTuningPanel } from "./components/AdvancedTuningPanel";
import { AppearanceSettingsPanel } from "./components/AppearanceSettingsPanel";
import { MetaPresetCard } from "./components/MetaPresetCard";
import { SettingsAccordion } from "./components/SettingsAccordion";
import { useBehaviorSettings } from "./hooks/useBehaviorSettings";
import { SettingsLayout } from "./SettingsLayout";

interface SettingsBehaviorViewProps {
  activeTab?: "behavior" | "appearance";
}

export function SettingsBehaviorView({ activeTab = "behavior" }: SettingsBehaviorViewProps) {
  const {
    settings,
    showAdvanced,
    setShowAdvanced,
    showAppearance,
    setShowAppearance,
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
    setTheme,
    setFontSize,
    setReduceMotion,
    setHapticFeedback,
  } = useBehaviorSettings();

  useEffect(() => {
    if (activeTab === "appearance") {
      setShowAppearance(true);
    }
  }, [activeTab, setShowAppearance]);

  return (
    <SettingsLayout
      activeTab={activeTab}
      title={activeTab === "appearance" ? "Darstellung" : "KI-Verhalten"}
      description={
        activeTab === "appearance"
          ? "Passe das Design und die Schriftgröße an."
          : "Wähle ein Profil oder passe die KI detailliert an deine Bedürfnisse an."
      }
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

        {/* Appearance Accordion */}
        <SettingsAccordion
          icon={Smartphone}
          title="Darstellung & Bedienung"
          description="Design, Schriftgröße und Animationen"
          isOpen={showAppearance}
          onToggle={() => setShowAppearance(!showAppearance)}
        >
          <AppearanceSettingsPanel
            theme={settings.theme}
            fontSize={settings.fontSize}
            reduceMotion={settings.reduceMotion}
            hapticFeedback={settings.hapticFeedback}
            onThemeChange={setTheme}
            onFontSizeChange={setFontSize}
            onReduceMotionToggle={() => setReduceMotion(!settings.reduceMotion)}
            onHapticFeedbackToggle={() => setHapticFeedback(!settings.hapticFeedback)}
          />
        </SettingsAccordion>
      </div>
    </SettingsLayout>
  );
}
