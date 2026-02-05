import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

import { isAllowedModelId } from "../config/modelDefaults";
import { DEFAULT_MODEL_ID } from "../config/modelPresets";
import { STORAGE_KEYS } from "../config/storageKeys";
import type { DiscussionPresetKey } from "../prompts/discussion/presets";

interface Settings {
  showNSFWContent: boolean;
  enableAnalytics: boolean;
  enableNotifications: boolean;
  enableNeko: boolean; // New Neko Feature
  theme: "light" | "dark" | "auto" | "oled";
  language: string;
  preferredModelId: string;
  creativity: number; // 0-100 slider value
  discussionPreset: DiscussionPresetKey;
  discussionStrict: boolean;
  discussionMaxSentences: number;
  fontSize: number;
  reduceMotion: boolean;
  oledMode: boolean; // OLED Dark Theme
  batterySaver: boolean; // Battery Saving Mode
  hapticFeedback: boolean;
  restoreLastConversation: boolean;
}

const DEFAULT_SETTINGS: Settings = {
  showNSFWContent: false,
  enableAnalytics: true,
  enableNotifications: true,
  enableNeko: false,
  theme: "auto",
  language: "de",
  preferredModelId: DEFAULT_MODEL_ID || "",
  creativity: 45,
  discussionPreset: "locker_neugierig",
  discussionStrict: false,
  discussionMaxSentences: 8,
  fontSize: 16,
  reduceMotion: false,
  oledMode: false,
  batterySaver: false,
  hapticFeedback: false,
  restoreLastConversation: true,
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

/**
 * One-time migration from legacy localStorage keys to unified settings store.
 * This function reads old individual keys and migrates them to the new structure.
 * After migration, the legacy keys are left in place for backwards compatibility
 * with any old code that might still reference them, but they are no longer synced.
 */
function migrateLegacySettings(): Partial<Settings> {
  const legacy: Partial<Settings> = {};

  try {
    // Migrate discussion preset (check both underscore and colon variants)
    const discussionPresetRaw =
      localStorage.getItem("disa:discussion:preset") ||
      localStorage.getItem("disa_discussion_preset");
    if (discussionPresetRaw) {
      legacy.discussionPreset = discussionPresetRaw as DiscussionPresetKey;
    }

    // Migrate discussion strict mode
    const discussionStrictRaw =
      localStorage.getItem("disa:discussion:strict") ||
      localStorage.getItem("disa_discussion_strict");
    if (discussionStrictRaw) {
      legacy.discussionStrict = discussionStrictRaw === "true";
    }

    // Migrate discussion max sentences
    const maxSentencesRaw =
      localStorage.getItem("disa:discussion:maxSentences") ||
      localStorage.getItem("disa_discussion_max_sentences");
    if (maxSentencesRaw) {
      legacy.discussionMaxSentences = parseInt(maxSentencesRaw, 10);
    }

    // Migrate font size
    const fontSizeRaw =
      localStorage.getItem("disa:ui:fontSize") || localStorage.getItem("disa_font_size");
    if (fontSizeRaw) {
      legacy.fontSize = parseInt(fontSizeRaw, 10);
    }

    // Migrate reduce motion
    const reduceMotionRaw =
      localStorage.getItem("disa:ui:reduceMotion") || localStorage.getItem("disa_reduce_motion");
    if (reduceMotionRaw) {
      legacy.reduceMotion = reduceMotionRaw === "true";
    }

    // Migrate haptic feedback
    const hapticRaw =
      localStorage.getItem("disa:ui:hapticFeedback") ||
      localStorage.getItem("disa_haptic_feedback");
    if (hapticRaw) {
      legacy.hapticFeedback = hapticRaw === "true";
    }
  } catch (error) {
    console.warn("Legacy settings migration failed:", error);
  }

  return legacy;
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

interface SettingsContextType {
  settings: Settings;
  toggleNSFWContent: () => void;
  toggleAnalytics: () => void;
  toggleNotifications: () => void;
  toggleNeko: () => void;
  setTheme: (theme: Settings["theme"]) => void;
  setLanguage: (language: string) => void;
  saveSettings: (updater: SettingsUpdater) => void;
  setPreferredModel: (id: string) => void;
  setCreativity: (val: number) => void;
  setDiscussionPreset: (val: DiscussionPresetKey) => void;
  setDiscussionStrict: (val: boolean) => void;
  setDiscussionMaxSentences: (val: number) => void;
  setFontSize: (val: number) => void;
  setReduceMotion: (val: boolean) => void;
  setOledMode: (val: boolean) => void;
  setBatterySaver: (val: boolean) => void;
  setHapticFeedback: (val: boolean) => void;
  toggleRestoreLastConversation: () => void;
  resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(() => {
    if (typeof window === "undefined") return DEFAULT_SETTINGS;

    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);

      // If unified settings exist, use them
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<Settings>;
        return normalizeSettings(parsed);
      }

      // Otherwise, perform one-time migration from legacy keys
      const legacy = migrateLegacySettings();
      const migrated = normalizeSettings(legacy);

      // Save migrated settings to unified store
      try {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(migrated));
        console.warn("✅ Settings migrated from legacy keys to unified store");
      } catch (saveError) {
        console.warn("Failed to save migrated settings:", saveError);
      }

      return migrated;
    } catch (error) {
      console.warn("Settings initialization failed, using defaults:", error);
      return DEFAULT_SETTINGS;
    }
  });

  const saveSettings = useCallback((updater: SettingsUpdater) => {
    try {
      setSettings((prev) => {
        const patch = typeof updater === "function" ? updater(prev) : updater;
        const updated = normalizeSettings({ ...prev, ...patch });
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
        // No more legacy sync - unified store is the single source of truth
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

  const setOledMode = useCallback(
    (oledMode: boolean) => {
      saveSettings({ oledMode });
    },
    [saveSettings],
  );

  const setBatterySaver = useCallback(
    (batterySaver: boolean) => {
      saveSettings({ batterySaver });
    },
    [saveSettings],
  );

  const toggleRestoreLastConversation = useCallback(() => {
    saveSettings((prev) => ({ restoreLastConversation: !prev.restoreLastConversation }));
  }, [saveSettings]);

  const resetSettings = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEYS.SETTINGS);
      const resetDefaults = normalizeSettings({});
      setSettings(resetDefaults);
      // Save defaults back to unified store
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(resetDefaults));
    } catch (error) {
      console.error("Failed to reset settings:", error);
    }
  }, []);

  // Side effects
  useEffect(() => {
    if (typeof document === "undefined") return;
    // OLED Mode overrides dark theme
    const effectiveTheme = settings.oledMode ? "oled" : settings.theme;
    document.documentElement.dataset.theme = effectiveTheme;
  }, [settings.theme, settings.oledMode]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.style.fontSize = `${settings.fontSize}px`;
  }, [settings.fontSize]);

  useEffect(() => {
    if (typeof document === "undefined" || typeof document.body === "undefined") return;
    document.body.classList.toggle("reduce-motion", settings.reduceMotion);
    document.documentElement.dataset.reduceMotion = settings.reduceMotion ? "true" : "false";
  }, [settings.reduceMotion]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.dataset.batterySaver = settings.batterySaver ? "true" : "false";

    // Battery Saver aktiviert automatisch Reduce Motion
    if (settings.batterySaver && !settings.reduceMotion) {
      document.documentElement.dataset.reduceMotion = "true";
    }
  }, [settings.batterySaver, settings.reduceMotion]);

  const value = {
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
    setOledMode,
    setBatterySaver,
    setHapticFeedback,
    toggleRestoreLastConversation,
    resetSettings,
  };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettingsContext() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettingsContext must be used within a SettingsProvider");
  }
  return context;
}
