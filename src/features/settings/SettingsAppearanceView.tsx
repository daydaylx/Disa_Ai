import { useSettings } from "@/hooks/useSettings";

import { AppearanceSettingsPanel } from "./components/AppearanceSettingsPanel";
import { SettingsLayout } from "./SettingsLayout";

export function SettingsAppearanceView() {
  const {
    settings,
    setTheme,
    setFontSize,
    setReduceMotion,
    setOledMode,
    setBatterySaver,
    setHapticFeedback,
  } = useSettings();

  return (
    <SettingsLayout
      activeTab="appearance"
      title="Darstellung"
      description="Passe Design, Schriftgröße und Animationen an."
    >
      <AppearanceSettingsPanel
        theme={settings.theme}
        fontSize={settings.fontSize}
        reduceMotion={settings.reduceMotion}
        oledMode={settings.oledMode}
        batterySaver={settings.batterySaver}
        hapticFeedback={settings.hapticFeedback}
        onThemeChange={setTheme}
        onFontSizeChange={setFontSize}
        onReduceMotionToggle={() => setReduceMotion(!settings.reduceMotion)}
        onOledModeToggle={() => setOledMode(!settings.oledMode)}
        onBatterySaverToggle={() => setBatterySaver(!settings.batterySaver)}
        onHapticFeedbackToggle={() => setHapticFeedback(!settings.hapticFeedback)}
      />
    </SettingsLayout>
  );
}
