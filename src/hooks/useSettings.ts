import { useCallback, useState } from "react";

interface Settings {
  showNSFWContent: boolean;
  enableAnalytics: boolean;
  enableNotifications: boolean;
  theme: "light" | "dark" | "auto";
  language: string;
}

const DEFAULT_SETTINGS: Settings = {
  showNSFWContent: false,
  enableAnalytics: true,
  enableNotifications: true,
  theme: "auto",
  language: "de",
};

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(() => {
    try {
      const saved = localStorage.getItem("disa-ai-settings");
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const saveSettings = useCallback(
    (newSettings: Partial<Settings>) => {
      try {
        const updated = { ...settings, ...newSettings };
        setSettings(updated);
        localStorage.setItem("disa-ai-settings", JSON.stringify(updated));
      } catch (error) {
        console.error("Failed to save settings:", error);
      }
    },
    [settings],
  );

  const toggleNSFWContent = useCallback(() => {
    saveSettings({ showNSFWContent: !settings.showNSFWContent });
  }, [saveSettings, settings.showNSFWContent]);

  const toggleAnalytics = useCallback(() => {
    saveSettings({ enableAnalytics: !settings.enableAnalytics });
  }, [saveSettings, settings.enableAnalytics]);

  const toggleNotifications = useCallback(() => {
    saveSettings({ enableNotifications: !settings.enableNotifications });
  }, [saveSettings, settings.enableNotifications]);

  const setTheme = useCallback(
    (theme: Settings["theme"]) => {
      saveSettings({ theme });
    },
    [saveSettings],
  );

  const setLanguage = useCallback(
    (language: string) => {
      saveSettings({ language });
    },
    [saveSettings],
  );

  return {
    settings,
    toggleNSFWContent,
    toggleAnalytics,
    toggleNotifications,
    setTheme,
    setLanguage,
    saveSettings,
  };
}
