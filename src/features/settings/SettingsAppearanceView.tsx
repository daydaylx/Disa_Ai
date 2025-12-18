import { useSettings } from "@/hooks/useSettings";

import { AppearanceSettingsPanel } from "./components/AppearanceSettingsPanel";
import { SettingsLayout } from "./SettingsLayout";

export function SettingsAppearanceView() {
  const { settings, setTheme, setFontSize, setReduceMotion, setHapticFeedback } = useSettings();

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
        hapticFeedback={settings.hapticFeedback}
        onThemeChange={setTheme}
        onFontSizeChange={setFontSize}
        onReduceMotionToggle={() => setReduceMotion(!settings.reduceMotion)}
        onHapticFeedbackToggle={() => setHapticFeedback(!settings.hapticFeedback)}
      />
    </SettingsLayout>
  );
}
