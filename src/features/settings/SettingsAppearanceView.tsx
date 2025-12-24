import { useSettings } from "@/hooks/useSettings";
import { useToasts } from "@/ui";

import { AppearanceSettingsPanel } from "./components/AppearanceSettingsPanel";
import { SettingsLayout } from "./SettingsLayout";

export function SettingsAppearanceView() {
  const { settings, setTheme, setFontSize, setReduceMotion, setHapticFeedback } = useSettings();
  const toasts = useToasts();

  const handleThemeChange = (theme: "light" | "dark" | "auto") => {
    setTheme(theme);
    const labels = { light: "Hell", dark: "Dunkel", auto: "Automatisch" };
    toasts.push({
      kind: "success",
      title: "Design geändert",
      message: `Design-Modus auf "${labels[theme]}" gesetzt.`,
    });
  };

  const handleReduceMotionToggle = () => {
    const newValue = !settings.reduceMotion;
    setReduceMotion(newValue);
    toasts.push({
      kind: "info",
      title: "Animationen",
      message: newValue ? "Animationen reduziert" : "Animationen aktiviert",
    });
  };

  const handleHapticFeedbackToggle = () => {
    const newValue = !settings.hapticFeedback;
    setHapticFeedback(newValue);
    toasts.push({
      kind: "info",
      title: "Haptisches Feedback",
      message: newValue ? "Feedback aktiviert" : "Feedback deaktiviert",
    });
  };

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
        onThemeChange={handleThemeChange}
        onFontSizeChange={setFontSize}
        onReduceMotionToggle={handleReduceMotionToggle}
        onHapticFeedbackToggle={handleHapticFeedbackToggle}
      />
    </SettingsLayout>
  );
}
