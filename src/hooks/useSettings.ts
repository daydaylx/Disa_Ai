import { useCallback, useEffect, useState } from "react";

export interface UserSettings {
  showNSFWContent: boolean;
  // Weitere Settings können hier hinzugefügt werden
}

const DEFAULT_SETTINGS: UserSettings = {
  showNSFWContent: false, // Standardmäßig deaktiviert für Sicherheit
};

const SETTINGS_KEY = "disa-ai-settings";

export function useSettings() {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Settings aus localStorage laden
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      }
    } catch (error) {
      console.warn("Failed to load settings from localStorage:", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Settings in localStorage speichern
  const updateSettings = useCallback((newSettings: Partial<UserSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
      } catch (error) {
        console.warn("Failed to save settings to localStorage:", error);
      }
      return updated;
    });
  }, []);

  const toggleNSFWContent = useCallback(() => {
    updateSettings({ showNSFWContent: !settings.showNSFWContent });
  }, [settings.showNSFWContent, updateSettings]);

  return {
    settings,
    isLoaded,
    updateSettings,
    toggleNSFWContent,
  };
}
