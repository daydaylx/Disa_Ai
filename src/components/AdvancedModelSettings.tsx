import React, { useState } from "react";

import {
  applyPreset,
  deleteCustomPreset,
  exportSettings,
  getAllPresets,
  getCurrentModelSettings,
  getDefaultPreset,
  importSettings,
  type ModelSettings,
  type ModelSettingsPreset,
  resetToDefaults,
  saveCustomPreset,
  saveModelSettings,
  validateModelSettings,
  VALIDATION_RULES,
} from "../lib/model-settings";
import { useToasts } from "./ui/Toast";

interface AdvancedModelSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsChange?: (settings: ModelSettings) => void;
}

export default function AdvancedModelSettings({
  isOpen,
  onClose,
  onSettingsChange,
}: AdvancedModelSettingsProps) {
  const [settings, setSettings] = useState<ModelSettings>(getCurrentModelSettings());
  const [presets, setPresets] = useState<ModelSettingsPreset[]>(getAllPresets());
  const [selectedPreset, setSelectedPreset] = useState<string>(getDefaultPreset().id);
  const [showPresetModal, setShowPresetModal] = useState(false);
  const [newPresetName, setNewPresetName] = useState("");
  const [newPresetDescription, setNewPresetDescription] = useState("");
  const [showImportModal, setShowImportModal] = useState(false);
  const { push } = useToasts();

  if (!isOpen) return null;

  const validation = validateModelSettings(settings);

  const updateSetting = <K extends keyof ModelSettings>(key: K, value: ModelSettings[K]) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
  };

  const handleSave = () => {
    if (!validation.isValid) {
      push({
        message: `Invalid settings: ${validation.errors.join(", ")}`,
        kind: "error",
      });
      return;
    }

    if (saveModelSettings(settings)) {
      onSettingsChange?.(settings);
      push({ message: "Settings saved successfully", kind: "success" });
    } else {
      push({ message: "Failed to save settings", kind: "error" });
    }
  };

  const handleApplyPreset = (presetId: string) => {
    if (applyPreset(presetId)) {
      const newSettings = getCurrentModelSettings();
      setSettings(newSettings);
      setSelectedPreset(presetId);
      onSettingsChange?.(newSettings);
      push({ message: "Preset applied successfully", kind: "success" });
    } else {
      push({ message: "Failed to apply preset", kind: "error" });
    }
  };

  const handleSavePreset = () => {
    if (!newPresetName.trim()) {
      push({ message: "Preset name is required", kind: "error" });
      return;
    }

    if (
      saveCustomPreset({
        name: newPresetName.trim(),
        description: newPresetDescription.trim() || "Custom preset",
        settings,
      })
    ) {
      setPresets(getAllPresets());
      setShowPresetModal(false);
      setNewPresetName("");
      setNewPresetDescription("");
      push({ message: "Preset saved successfully", kind: "success" });
    } else {
      push({ message: "Failed to save preset", kind: "error" });
    }
  };

  const handleDeletePreset = (presetId: string) => {
    const preset = presets.find((p) => p.id === presetId);
    if (!preset?.isCustom) return;

    if (window.confirm(`Delete preset "${preset.name}"?`)) {
      if (deleteCustomPreset(presetId)) {
        setPresets(getAllPresets());
        push({ message: "Preset deleted", kind: "success" });
      } else {
        push({ message: "Failed to delete preset", kind: "error" });
      }
    }
  };

  const handleExport = () => {
    const exportData = exportSettings();
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `disa-model-settings-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    push({ message: "Settings exported successfully", kind: "success" });
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importData = JSON.parse(e.target?.result as string);
        const result = importSettings(importData);

        if (result.success) {
          setSettings(getCurrentModelSettings());
          setPresets(getAllPresets());
          push({ message: "Settings imported successfully", kind: "success" });
        } else {
          push({
            message: `Import completed with errors: ${result.errors.join(", ")}`,
            kind: "warning",
          });
        }
      } catch {
        push({ message: "Invalid import file format", kind: "error" });
      }

      setShowImportModal(false);
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (window.confirm("Reset all settings to defaults? This cannot be undone.")) {
      if (resetToDefaults()) {
        const defaultSettings = getCurrentModelSettings();
        setSettings(defaultSettings);
        setSelectedPreset(getDefaultPreset().id);
        onSettingsChange?.(defaultSettings);
        push({ message: "Settings reset to defaults", kind: "success" });
      } else {
        push({ message: "Failed to reset settings", kind: "error" });
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative mx-4 max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-2xl border border-slate-700 bg-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-700 p-6">
          <div>
            <h2 className="text-xl font-semibold text-slate-100">Advanced Model Settings</h2>
            <p className="mt-1 text-sm text-slate-400">
              Fine-tune model behavior and response characteristics
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-300"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6 6 18" />
              <path d="M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[70vh] overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Presets */}
            <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4">
              <h3 className="mb-3 text-lg font-semibold text-slate-200">Presets</h3>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                {presets.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handleApplyPreset(preset.id)}
                    className={`relative rounded-lg border p-3 text-left transition-all ${
                      selectedPreset === preset.id
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-slate-600 bg-slate-800 hover:bg-slate-700"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-slate-200">{preset.name}</h4>
                        <p className="mt-1 text-xs text-slate-400">{preset.description}</p>
                      </div>
                      {preset.isCustom && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePreset(preset.id);
                          }}
                          className="ml-2 rounded p-1 text-slate-400 hover:bg-red-900/20 hover:text-red-400"
                          title="Delete preset"
                        >
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M3 6h18" />
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </button>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => setShowPresetModal(true)}
                  className="rounded-lg border border-blue-600 bg-blue-600/10 px-3 py-2 text-sm text-blue-400 hover:bg-blue-600/20"
                >
                  Save as Preset
                </button>
              </div>
            </div>

            {/* Core Settings */}
            <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4">
              <h3 className="mb-4 text-lg font-semibold text-slate-200">Core Parameters</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Temperature */}
                <div>
                  <label className="block text-sm font-medium text-slate-300">
                    Temperature: {settings.temperature}
                  </label>
                  <input
                    type="range"
                    min={VALIDATION_RULES.temperature.min}
                    max={VALIDATION_RULES.temperature.max}
                    step={VALIDATION_RULES.temperature.step}
                    value={settings.temperature}
                    onChange={(e) => updateSetting("temperature", parseFloat(e.target.value))}
                    className="mt-1 w-full"
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    Controls randomness (0 = deterministic, 2 = very random)
                  </p>
                </div>

                {/* Top-P */}
                <div>
                  <label className="block text-sm font-medium text-slate-300">
                    Top-P: {settings.topP}
                  </label>
                  <input
                    type="range"
                    min={VALIDATION_RULES.topP.min}
                    max={VALIDATION_RULES.topP.max}
                    step={VALIDATION_RULES.topP.step}
                    value={settings.topP}
                    onChange={(e) => updateSetting("topP", parseFloat(e.target.value))}
                    className="mt-1 w-full"
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    Nucleus sampling threshold (lower = more focused)
                  </p>
                </div>

                {/* Max Tokens */}
                <div>
                  <label className="block text-sm font-medium text-slate-300">
                    Max Tokens: {settings.maxTokens}
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={8192}
                    step={1}
                    value={settings.maxTokens}
                    onChange={(e) => updateSetting("maxTokens", parseInt(e.target.value))}
                    className="mt-1 w-full"
                  />
                  <p className="mt-1 text-xs text-slate-500">Maximum tokens in response</p>
                </div>

                {/* Frequency Penalty */}
                <div>
                  <label className="block text-sm font-medium text-slate-300">
                    Frequency Penalty: {settings.frequencyPenalty}
                  </label>
                  <input
                    type="range"
                    min={VALIDATION_RULES.frequencyPenalty.min}
                    max={VALIDATION_RULES.frequencyPenalty.max}
                    step={VALIDATION_RULES.frequencyPenalty.step}
                    value={settings.frequencyPenalty}
                    onChange={(e) => updateSetting("frequencyPenalty", parseFloat(e.target.value))}
                    className="mt-1 w-full"
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    Reduce repetition (positive = less repetition)
                  </p>
                </div>
              </div>
            </div>

            {/* Advanced Settings */}
            <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4">
              <h3 className="mb-4 text-lg font-semibold text-slate-200">Advanced Parameters</h3>

              {/* Presence Penalty */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-300">
                  Presence Penalty: {settings.presencePenalty}
                </label>
                <input
                  type="range"
                  min={VALIDATION_RULES.presencePenalty.min}
                  max={VALIDATION_RULES.presencePenalty.max}
                  step={VALIDATION_RULES.presencePenalty.step}
                  value={settings.presencePenalty}
                  onChange={(e) => updateSetting("presencePenalty", parseFloat(e.target.value))}
                  className="mt-1 w-full"
                />
                <p className="mt-1 text-xs text-slate-500">
                  Encourage new topics (positive = more diverse)
                </p>
              </div>

              {/* Stop Sequences */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-300">Stop Sequences</label>
                <textarea
                  value={settings.stopSequences.join("\\n")}
                  onChange={(e) =>
                    updateSetting(
                      "stopSequences",
                      e.target.value.split("\\n").filter((s) => s.trim()),
                    )
                  }
                  placeholder="Enter stop sequences separated by \\n"
                  className="mt-1 w-full rounded border border-slate-600 bg-slate-800 p-2 text-slate-200 placeholder-slate-400"
                  rows={3}
                />
                <p className="mt-1 text-xs text-slate-500">
                  Sequences that stop generation (max 10, 50 chars each)
                </p>
              </div>

              {/* System Prompt */}
              <div>
                <label className="block text-sm font-medium text-slate-300">
                  System Prompt Override
                </label>
                <textarea
                  value={settings.systemPrompt || ""}
                  onChange={(e) => updateSetting("systemPrompt", e.target.value || undefined)}
                  placeholder="Optional system prompt to override default behavior"
                  className="mt-1 w-full rounded border border-slate-600 bg-slate-800 p-2 text-slate-200 placeholder-slate-400"
                  rows={4}
                />
                <p className="mt-1 text-xs text-slate-500">
                  Custom instructions for the AI (max 2000 chars)
                </p>
              </div>
            </div>

            {/* Validation */}
            {!validation.isValid && (
              <div className="rounded-lg border border-red-600 bg-red-600/10 p-4">
                <h4 className="font-medium text-red-400">Validation Errors</h4>
                <ul className="mt-2 list-inside list-disc text-sm text-red-300">
                  {validation.errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-700 p-6">
          <div className="flex justify-between">
            <div className="flex gap-2">
              <button
                onClick={handleExport}
                className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700"
              >
                Export
              </button>
              <button
                onClick={() => setShowImportModal(true)}
                className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700"
              >
                Import
              </button>
              <button
                onClick={handleReset}
                className="rounded-lg border border-orange-600 bg-orange-600/10 px-3 py-2 text-sm text-orange-400 hover:bg-orange-600/20"
              >
                Reset to Defaults
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="rounded-lg border border-slate-600 bg-slate-800 px-4 py-2 text-slate-300 hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!validation.isValid}
                className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Save Preset Modal */}
      {showPresetModal && (
        <div className="z-60 fixed inset-0 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowPresetModal(false)} />
          <div className="relative w-96 rounded-lg border border-slate-700 bg-slate-900 p-6">
            <h3 className="mb-4 text-lg font-semibold text-slate-100">Save Preset</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300">Name</label>
                <input
                  type="text"
                  value={newPresetName}
                  onChange={(e) => setNewPresetName(e.target.value)}
                  className="mt-1 w-full rounded border border-slate-600 bg-slate-800 p-2 text-slate-200"
                  placeholder="My Custom Preset"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300">Description</label>
                <textarea
                  value={newPresetDescription}
                  onChange={(e) => setNewPresetDescription(e.target.value)}
                  className="mt-1 w-full rounded border border-slate-600 bg-slate-800 p-2 text-slate-200"
                  placeholder="Description of this preset..."
                  rows={3}
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setShowPresetModal(false)}
                className="rounded border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePreset}
                className="rounded bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="z-60 fixed inset-0 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowImportModal(false)} />
          <div className="relative w-96 rounded-lg border border-slate-700 bg-slate-900 p-6">
            <h3 className="mb-4 text-lg font-semibold text-slate-100">Import Settings</h3>
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="w-full rounded border border-slate-600 bg-slate-800 p-3 text-slate-200"
            />
            <p className="mt-2 text-xs text-slate-400">Select a JSON file exported from Disa AI</p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowImportModal(false)}
                className="rounded border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
