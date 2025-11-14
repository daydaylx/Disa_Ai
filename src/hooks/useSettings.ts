import { useCallback, useState } from "react";

interface Settings {
  showNSFWContent: boolean;
  enableAnalytics: boolean;
  enableNotifications: boolean;
  theme: "light" | "dark" | "auto";
  language: string;
  preferredModelId: string;
}

const DEFAULT_SETTINGS: Settings = {
  showNSFWContent: false,
  enableAnalytics: true,
  enableNotifications: true,
  theme: "auto",
  language: "de",
  preferredModelId: "openai/gpt-4o-mini",
};

type SettingsUpdater = Partial<Settings> | ((previous: Settings) => Partial<Settings>);

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(() => {
    try {
      const saved = localStorage.getItem("disa-ai-settings");
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const saveSettings = useCallback((updater: SettingsUpdater) => {
    try {
      setSettings((prev) => {
        const patch = typeof updater === "function" ? updater(prev) : updater;
        const updated = { ...prev, ...patch };
        localStorage.setItem("disa-ai-settings", JSON.stringify(updated));
        return updated;
      });
    } catch (error) {
      console.error("Failed to save settings:", error);
    }
  }, []);

  const toggleNSFWContent = useCallback(() => {
    saveSettings((prev) => ({ showNSFWContent: !prev.showNSFWContent }));
  }, [saveSettings]);

  const toggleAnalytics = useCallback(() => {
    saveSettings((prev) => ({ enableAnalytics: !prev.enableAnalytics }));
  }, [saveSettings]);

  const toggleNotifications = useCallback(() => {
    saveSettings((prev) => ({ enableNotifications: !prev.enableNotifications }));
  }, [saveSettings]);

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

  const setPreferredModel = useCallback(
    (preferredModelId: string) => {
      saveSettings({ preferredModelId });
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
    setPreferredModel,
  };
}
