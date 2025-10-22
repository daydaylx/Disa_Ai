import { useCallback, useEffect, useState } from "react";

export interface UserSettings {
  showNSFWContent: boolean;
  // Weitere Settings können hier hinzugefügt werden
}

const DEFAULT_SETTINGS: UserSettings = {
  showNSFWContent: false, // Standardmäßig deaktiviert für Sicherheit
};

const SETTINGS_KEY = "disa-ai-settings";

let cachedSettings: UserSettings = { ...DEFAULT_SETTINGS };
let settingsInitialized = false;
const subscribers = new Set<(settings: UserSettings) => void>();

const loadSettingsFromStorage = () => {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      cachedSettings = { ...DEFAULT_SETTINGS, ...parsed };
    } else {
      cachedSettings = { ...DEFAULT_SETTINGS };
    }
  } catch {
    // Error handling for loading settings - using defaults if loading fails
    cachedSettings = { ...DEFAULT_SETTINGS };
  }
  settingsInitialized = true;
};

const notifySubscribers = (settings: UserSettings) => {
  subscribers.forEach((listener) => {
    try {
      listener(settings);
    } catch {
      // Error handling for settings subscriber - ignoring individual subscriber failures
    }
  });
};

export function useSettings() {
  const [settings, setSettings] = useState<UserSettings>(() => {
    if (typeof window !== "undefined" && !settingsInitialized) {
      loadSettingsFromStorage();
    }
    return cachedSettings;
  });
  const [isLoaded, setIsLoaded] = useState(settingsInitialized);

  useEffect(() => {
    const listener = (next: UserSettings) => setSettings(next);
    subscribers.add(listener);

    if (!settingsInitialized && typeof window !== "undefined") {
      loadSettingsFromStorage();
      setSettings(cachedSettings);
      setIsLoaded(true);
    } else {
      setIsLoaded(true);
    }

    return () => {
      subscribers.delete(listener);
    };
  }, []);

  const updateSettings = useCallback((newSettings: Partial<UserSettings>) => {
    cachedSettings = { ...cachedSettings, ...newSettings };
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(cachedSettings));
    } catch {
      // Error handling for saving settings - silently fail to avoid disrupting UX
    }
    notifySubscribers(cachedSettings);
  }, []);

  const toggleNSFWContent = useCallback(() => {
    updateSettings({ showNSFWContent: !cachedSettings.showNSFWContent });
  }, [updateSettings]);

  return {
    settings,
    isLoaded,
    updateSettings,
    toggleNSFWContent,
  };
}
