import { useCallback, useEffect, useState } from "react";

import { isAllowedModelId } from "../config/modelDefaults";
import { DEFAULT_MODEL_ID } from "../config/modelPresets";
import {
  getDiscussionMaxSentences,
  getDiscussionPreset,
  getDiscussionStrictMode,
  getFontSize,
  getHapticFeedback,
  getReduceMotion,
  setDiscussionMaxSentences as setLegacyDiscussionMaxSentences,
  setDiscussionPreset as setLegacyDiscussionPreset,
  setDiscussionStrictMode as setLegacyDiscussionStrictMode,
  setFontSize as setLegacyFontSize,
  setHapticFeedback as setLegacyHapticFeedback,
  setReduceMotion as setLegacyReduceMotion,
} from "../config/settings";
import { STORAGE_KEYS } from "../config/storageKeys";
import type { DiscussionPresetKey } from "../prompts/discussion/presets";

interface Settings {
  showNSFWContent: boolean;
  enableAnalytics: boolean;
  enableNotifications: boolean;
  enableNeko: boolean; // New Neko Feature
  theme: "light" | "dark" | "auto";
  language: string;
  preferredModelId: string;
  creativity: number; // 0-100 slider value
  discussionPreset: DiscussionPresetKey;
  discussionStrict: boolean;
  discussionMaxSentences: number;
  fontSize: number;
  reduceMotion: boolean;
  hapticFeedback: boolean;
  restoreLastConversation: boolean;
  hasCompletedOnboarding: boolean;
}

const DEFAULT_SETTINGS: Settings = {
  showNSFWContent: false,
  enableAnalytics: true,
  enableNotifications: true,
  enableNeko: false, // Extras sind nun opt-in
  theme: "auto",
  language: "de",
  preferredModelId: DEFAULT_MODEL_ID || "",
  creativity: 45,
  discussionPreset: "locker_neugierig",
  discussionStrict: false,
  discussionMaxSentences: 8,
  fontSize: 16,
  reduceMotion: false,
  hapticFeedback: false,
  restoreLastConversation: true,
  hasCompletedOnboarding: false,
};

type SettingsUpdater = Partial<Settings> | ((previous: Settings) => Partial<Settings>);

function normalizePreferredModelId(modelId: string | undefined): string {
  const candidate = modelId ?? DEFAULT_MODEL_ID ?? "";
  if (!candidate) return "";
  return isAllowedModelId(candidate) ? candidate : "";
}

function clampCreativity(value: number | undefined): number {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return DEFAULT_SETTINGS.creativity;
  return Math.min(100, Math.max(0, Math.round(numeric)));
}

function clampSentences(value: number | undefined): number {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return DEFAULT_SETTINGS.discussionMaxSentences;
  return Math.min(10, Math.max(5, Math.round(numeric)));
}

function clampFontSize(value: number | undefined): number {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return DEFAULT_SETTINGS.fontSize;
  return Math.max(12, Math.min(24, Math.floor(numeric)));
}

function readLegacySettings(): Partial<Settings> {
  // Legacy single-key storage is still read for migration; writes are optional.
  return {
    discussionPreset: getDiscussionPreset(),
    discussionStrict: getDiscussionStrictMode(),
    discussionMaxSentences: getDiscussionMaxSentences(),
    fontSize: getFontSize(),
    reduceMotion: getReduceMotion(),
    hapticFeedback: getHapticFeedback(),
  };
}

function normalizeSettings(raw: Partial<Settings>): Settings {
  const preferredModelId = normalizePreferredModelId(raw.preferredModelId);

  return {
    ...DEFAULT_SETTINGS,
    ...raw,
    preferredModelId,
    creativity: clampCreativity(raw.creativity ?? DEFAULT_SETTINGS.creativity),
    discussionMaxSentences: clampSentences(
      raw.discussionMaxSentences ?? DEFAULT_SETTINGS.discussionMaxSentences,
    ),
    fontSize: clampFontSize(raw.fontSize ?? DEFAULT_SETTINGS.fontSize),
  };
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(() => {
    if (typeof window === "undefined") return DEFAULT_SETTINGS;

    const legacy = readLegacySettings();
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (!saved) return normalizeSettings(legacy);
      const parsed = JSON.parse(saved) as Partial<Settings>;
      return normalizeSettings({ ...legacy, ...parsed });
    } catch (error) {
      console.warn("Falling back to default settings due to parse error:", error);
      return normalizeSettings(legacy);
    }
  });

  const syncLegacyStores = useCallback((next: Settings) => {
    try {
      setLegacyDiscussionPreset(next.discussionPreset);
      setLegacyDiscussionStrictMode(next.discussionStrict);
      setLegacyDiscussionMaxSentences(next.discussionMaxSentences);
      setLegacyFontSize(next.fontSize);
      setLegacyReduceMotion(next.reduceMotion);
      setLegacyHapticFeedback(next.hapticFeedback);
    } catch (error) {
      console.warn("Legacy settings sync skipped:", error);
    }
  }, []);

  const saveSettings = useCallback(
    (updater: SettingsUpdater) => {
      try {
        setSettings((prev) => {
          const patch = typeof updater === "function" ? updater(prev) : updater;
          const updated = normalizeSettings({ ...prev, ...patch });
          localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
          syncLegacyStores(updated);
          return updated;
        });
      } catch (error) {
        console.error("Failed to save settings:", error);
      }
    },
    [syncLegacyStores],
  );

  const toggleNSFWContent = useCallback(() => {
    saveSettings((prev) => ({ showNSFWContent: !prev.showNSFWContent }));
  }, [saveSettings]);

  const toggleAnalytics = useCallback(() => {
    saveSettings((prev) => ({ enableAnalytics: !prev.enableAnalytics }));
  }, [saveSettings]);

  const toggleNotifications = useCallback(() => {
    saveSettings((prev) => ({ enableNotifications: !prev.enableNotifications }));
  }, [saveSettings]);

  const toggleNeko = useCallback(() => {
    saveSettings((prev) => ({ enableNeko: !prev.enableNeko }));
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

  const setCreativity = useCallback(
    (creativity: number) => {
      saveSettings({ creativity: clampCreativity(creativity) });
    },
    [saveSettings],
  );

  const setDiscussionPreset = useCallback(
    (discussionPreset: DiscussionPresetKey) => {
      saveSettings({ discussionPreset });
    },
    [saveSettings],
  );

  const setDiscussionStrict = useCallback(
    (discussionStrict: boolean) => {
      saveSettings({ discussionStrict });
    },
    [saveSettings],
  );

  const setDiscussionMaxSentences = useCallback(
    (discussionMaxSentences: number) => {
      saveSettings({ discussionMaxSentences: clampSentences(discussionMaxSentences) });
    },
    [saveSettings],
  );

  const setFontSize = useCallback(
    (fontSize: number) => {
      saveSettings({ fontSize: clampFontSize(fontSize) });
    },
    [saveSettings],
  );

  const setReduceMotion = useCallback(
    (reduceMotion: boolean) => {
      saveSettings({ reduceMotion });
    },
    [saveSettings],
  );

  const setHapticFeedback = useCallback(
    (hapticFeedback: boolean) => {
      saveSettings({ hapticFeedback });
    },
    [saveSettings],
  );

  const toggleRestoreLastConversation = useCallback(() => {
    saveSettings((prev) => ({ restoreLastConversation: !prev.restoreLastConversation }));
  }, [saveSettings]);

  const completeOnboarding = useCallback(() => {
    saveSettings({ hasCompletedOnboarding: true });
  }, [saveSettings]);

  const resetSettings = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEYS.SETTINGS);
      const resetDefaults = normalizeSettings({});
      setSettings(resetDefaults);
      syncLegacyStores(resetDefaults);
    } catch (error) {
      console.error("Failed to reset settings:", error);
    }
  }, [syncLegacyStores]);

  // Side effects that should always reflect persisted state
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.dataset.theme = settings.theme;
  }, [settings.theme]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.style.fontSize = `${settings.fontSize}px`;
  }, [settings.fontSize]);

  useEffect(() => {
    if (typeof document === "undefined" || typeof document.body === "undefined") return;
    document.body.classList.toggle("reduce-motion", settings.reduceMotion);
  }, [settings.reduceMotion]);

  return {
    settings,
    toggleNSFWContent,
    toggleAnalytics,
    toggleNotifications,
    toggleNeko,
    setTheme,
    setLanguage,
    saveSettings,
    setPreferredModel,
    setCreativity,
    setDiscussionPreset,
    setDiscussionStrict,
    setDiscussionMaxSentences,
    setFontSize,
    setReduceMotion,
    setHapticFeedback,
    toggleRestoreLastConversation,
    completeOnboarding,
    resetSettings,
  };
}
