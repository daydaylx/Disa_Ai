/**
 * Advanced Model Settings Management
 *
 * Handles temperature, top-P, max-tokens, and other model parameters
 * with validation, presets, and persistence
 */

export interface ModelSettings {
  /** Temperature controls randomness (0.0 - 2.0) */
  temperature: number;
  /** Top-P controls diversity via nucleus sampling (0.0 - 1.0) */
  topP: number;
  /** Maximum tokens in response (1 - model's context limit) */
  maxTokens: number;
  /** Stop sequences to end generation */
  stopSequences: string[];
  /** Frequency penalty (-2.0 - 2.0) */
  frequencyPenalty: number;
  /** Presence penalty (-2.0 - 2.0) */
  presencePenalty: number;
  /** System prompt override */
  systemPrompt?: string;
}

export interface ModelSettingsPreset {
  id: string;
  name: string;
  description: string;
  settings: ModelSettings;
  isDefault?: boolean;
  isCustom?: boolean;
}

const DEFAULT_SETTINGS: ModelSettings = {
  temperature: 0.7,
  topP: 0.9,
  maxTokens: 2048,
  stopSequences: [],
  frequencyPenalty: 0,
  presencePenalty: 0,
  systemPrompt: undefined,
};

const BUILTIN_PRESETS: ModelSettingsPreset[] = [
  {
    id: "balanced",
    name: "Balanced",
    description: "Good balance of creativity and consistency",
    settings: {
      temperature: 0.7,
      topP: 0.9,
      maxTokens: 2048,
      stopSequences: [],
      frequencyPenalty: 0,
      presencePenalty: 0,
    },
    isDefault: true,
  },
  {
    id: "creative",
    name: "Creative",
    description: "Higher randomness for creative writing",
    settings: {
      temperature: 1.2,
      topP: 0.95,
      maxTokens: 3072,
      stopSequences: [],
      frequencyPenalty: 0.5,
      presencePenalty: 0.3,
    },
  },
  {
    id: "precise",
    name: "Precise",
    description: "Lower temperature for factual, consistent responses",
    settings: {
      temperature: 0.3,
      topP: 0.7,
      maxTokens: 2048,
      stopSequences: [],
      frequencyPenalty: 0,
      presencePenalty: 0,
    },
  },
  {
    id: "concise",
    name: "Concise",
    description: "Shorter responses with early stopping",
    settings: {
      temperature: 0.5,
      topP: 0.8,
      maxTokens: 512,
      stopSequences: ["\n\n", "---"],
      frequencyPenalty: 0.2,
      presencePenalty: 0.1,
    },
  },
  {
    id: "analytical",
    name: "Analytical",
    description: "Optimized for analysis and reasoning",
    settings: {
      temperature: 0.4,
      topP: 0.75,
      maxTokens: 4096,
      stopSequences: [],
      frequencyPenalty: -0.1,
      presencePenalty: 0.1,
      systemPrompt:
        "You are an analytical assistant. Provide detailed, structured analysis with clear reasoning.",
    },
  },
];

const STORAGE_KEY = "disa:model-settings";
const PRESETS_STORAGE_KEY = "disa:model-presets";

/**
 * Validation constraints for model settings
 */
export const VALIDATION_RULES = {
  temperature: { min: 0, max: 2, step: 0.1 },
  topP: { min: 0, max: 1, step: 0.05 },
  maxTokens: { min: 1, max: 32768, step: 1 },
  frequencyPenalty: { min: -2, max: 2, step: 0.1 },
  presencePenalty: { min: -2, max: 2, step: 0.1 },
  stopSequences: { maxCount: 10, maxLength: 50 },
  systemPrompt: { maxLength: 2000 },
};

/**
 * Validate model settings against rules
 */
export function validateModelSettings(settings: Partial<ModelSettings>): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (settings.temperature !== undefined) {
    const { min, max } = VALIDATION_RULES.temperature;
    if (settings.temperature < min || settings.temperature > max) {
      errors.push(`Temperature must be between ${min} and ${max}`);
    }
  }

  if (settings.topP !== undefined) {
    const { min, max } = VALIDATION_RULES.topP;
    if (settings.topP < min || settings.topP > max) {
      errors.push(`Top-P must be between ${min} and ${max}`);
    }
  }

  if (settings.maxTokens !== undefined) {
    const { min, max } = VALIDATION_RULES.maxTokens;
    if (settings.maxTokens < min || settings.maxTokens > max) {
      errors.push(`Max tokens must be between ${min} and ${max}`);
    }
  }

  if (settings.frequencyPenalty !== undefined) {
    const { min, max } = VALIDATION_RULES.frequencyPenalty;
    if (settings.frequencyPenalty < min || settings.frequencyPenalty > max) {
      errors.push(`Frequency penalty must be between ${min} and ${max}`);
    }
  }

  if (settings.presencePenalty !== undefined) {
    const { min, max } = VALIDATION_RULES.presencePenalty;
    if (settings.presencePenalty < min || settings.presencePenalty > max) {
      errors.push(`Presence penalty must be between ${min} and ${max}`);
    }
  }

  if (settings.stopSequences !== undefined) {
    const { maxCount, maxLength } = VALIDATION_RULES.stopSequences;
    if (settings.stopSequences.length > maxCount) {
      errors.push(`Maximum ${maxCount} stop sequences allowed`);
    }
    const invalidSequences = settings.stopSequences.filter((seq) => seq.length > maxLength);
    if (invalidSequences.length > 0) {
      errors.push(`Stop sequences must be ${maxLength} characters or less`);
    }
  }

  if (
    settings.systemPrompt !== undefined &&
    settings.systemPrompt.length > VALIDATION_RULES.systemPrompt.maxLength
  ) {
    errors.push(
      `System prompt must be ${VALIDATION_RULES.systemPrompt.maxLength} characters or less`,
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Get current model settings from storage
 */
export function getCurrentModelSettings(): ModelSettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return { ...DEFAULT_SETTINGS };

    const settings = JSON.parse(stored) as ModelSettings;

    // Validate and merge with defaults
    const validation = validateModelSettings(settings);
    if (!validation.isValid) {
      console.warn("Invalid stored settings, using defaults:", validation.errors);
      return { ...DEFAULT_SETTINGS };
    }

    return { ...DEFAULT_SETTINGS, ...settings };
  } catch (error) {
    console.error("Failed to load model settings:", error);
    return { ...DEFAULT_SETTINGS };
  }
}

/**
 * Save model settings to storage
 */
export function saveModelSettings(settings: ModelSettings): boolean {
  const validation = validateModelSettings(settings);
  if (!validation.isValid) {
    console.error("Cannot save invalid settings:", validation.errors);
    return false;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    return true;
  } catch (error) {
    console.error("Failed to save model settings:", error);
    return false;
  }
}

/**
 * Get all available presets (built-in + custom)
 */
export function getAllPresets(): ModelSettingsPreset[] {
  const customPresets = getCustomPresets();
  return [...BUILTIN_PRESETS, ...customPresets];
}

/**
 * Get custom user presets
 */
function getCustomPresets(): ModelSettingsPreset[] {
  try {
    const stored = localStorage.getItem(PRESETS_STORAGE_KEY);
    if (!stored) return [];

    return JSON.parse(stored) as ModelSettingsPreset[];
  } catch (error) {
    console.error("Failed to load custom presets:", error);
    return [];
  }
}

/**
 * Save custom preset
 */
export function saveCustomPreset(preset: Omit<ModelSettingsPreset, "id" | "isCustom">): boolean {
  const validation = validateModelSettings(preset.settings);
  if (!validation.isValid) {
    console.error("Cannot save preset with invalid settings:", validation.errors);
    return false;
  }

  const customPresets = getCustomPresets();
  const newPreset: ModelSettingsPreset = {
    ...preset,
    id: `custom_${Date.now()}_${Math.random().toString(36).substring(2)}`,
    isCustom: true,
  };

  customPresets.push(newPreset);

  try {
    localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(customPresets));
    return true;
  } catch (error) {
    console.error("Failed to save custom preset:", error);
    return false;
  }
}

/**
 * Delete custom preset
 */
export function deleteCustomPreset(presetId: string): boolean {
  const customPresets = getCustomPresets();
  const filteredPresets = customPresets.filter((p) => p.id !== presetId);

  if (filteredPresets.length === customPresets.length) {
    return false; // Preset not found
  }

  try {
    localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(filteredPresets));
    return true;
  } catch (error) {
    console.error("Failed to delete custom preset:", error);
    return false;
  }
}

/**
 * Apply preset to current settings
 */
export function applyPreset(presetId: string): boolean {
  const presets = getAllPresets();
  const preset = presets.find((p) => p.id === presetId);

  if (!preset) {
    console.error("Preset not found:", presetId);
    return false;
  }

  return saveModelSettings(preset.settings);
}

/**
 * Reset to default settings
 */
export function resetToDefaults(): boolean {
  return saveModelSettings({ ...DEFAULT_SETTINGS });
}

/**
 * Get preset by ID
 */
export function getPreset(presetId: string): ModelSettingsPreset | null {
  const presets = getAllPresets();
  return presets.find((p) => p.id === presetId) || null;
}

/**
 * Get default preset
 */
export function getDefaultPreset(): ModelSettingsPreset {
  const preset = BUILTIN_PRESETS.find((p) => p.isDefault) ?? BUILTIN_PRESETS[0];
  if (!preset) {
    throw new Error("No default model settings preset configured");
  }
  return preset;
}

/**
 * Export settings and presets for backup
 */
export function exportSettings() {
  const currentSettings = getCurrentModelSettings();
  const customPresets = getCustomPresets();

  return {
    version: "1.0",
    exportDate: Date.now(),
    currentSettings,
    customPresets,
  };
}

/**
 * Import settings and presets from backup
 */
export function importSettings(importData: any): {
  success: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  try {
    if (importData.currentSettings) {
      const validation = validateModelSettings(importData.currentSettings);
      if (validation.isValid) {
        saveModelSettings(importData.currentSettings);
      } else {
        errors.push("Invalid current settings: " + validation.errors.join(", "));
      }
    }

    if (importData.customPresets && Array.isArray(importData.customPresets)) {
      const validPresets = importData.customPresets.filter((preset: any) => {
        const validation = validateModelSettings(preset.settings);
        return validation.isValid;
      });

      if (validPresets.length > 0) {
        localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(validPresets));
      }

      const invalidCount = importData.customPresets.length - validPresets.length;
      if (invalidCount > 0) {
        errors.push(`${invalidCount} invalid presets were skipped`);
      }
    }

    return { success: errors.length === 0, errors };
  } catch (error) {
    return {
      success: false,
      errors: [`Import failed: ${error instanceof Error ? error.message : "Unknown error"}`],
    };
  }
}
