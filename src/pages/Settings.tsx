import {
  Download,
  Globe,
  Key,
  Palette,
  Plus,
  Save,
  Settings,
  Shield,
  Trash2,
  Upload,
  Zap,
} from "lucide-react";
import React, { useEffect, useState } from "react";

import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Switch } from "../components/ui/Switch";
import { Textarea } from "../components/ui/textarea";
import { useToasts } from "../components/ui/toast/ToastsProvider";
import { cn } from "../lib/utils";

interface ConversationPreset {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
  temperature: number;
  maxTokens: number;
  model: string;
  starterPrompts: string[];
  tags: string[];
  isPublic: boolean;
  createdAt: number;
  updatedAt: number;
}

interface AppSettings {
  theme: "light" | "dark" | "system";
  language: string;
  fontSize: "small" | "medium" | "large";
  enableSounds: boolean;
  enableNotifications: boolean;
  autoSave: boolean;
  maxMessageHistory: number;
  defaultModel: string;
}

const DEFAULT_SETTINGS: AppSettings = {
  theme: "system",
  language: "en",
  fontSize: "medium",
  enableSounds: true,
  enableNotifications: true,
  autoSave: true,
  maxMessageHistory: 100,
  defaultModel: "meta-llama/llama-3.3-70b-instruct:free",
};

const DEFAULT_PRESET: Omit<ConversationPreset, "id" | "createdAt" | "updatedAt"> = {
  name: "",
  description: "",
  systemPrompt: "",
  temperature: 0.7,
  maxTokens: 2048,
  model: "meta-llama/llama-3.3-70b-instruct:free",
  starterPrompts: [],
  tags: [],
  isPublic: false,
};

const _STARTER_TEMPLATE_CATEGORIES = {
  General: [
    "Explain this concept in simple terms:",
    "What are the pros and cons of:",
    "Help me brainstorm ideas for:",
    "Summarize the key points of:",
  ],
  Creative: [
    "Write a story about:",
    "Create a poem inspired by:",
    "Generate creative ideas for:",
    "Help me design:",
  ],
  Professional: [
    "Write a professional email about:",
    "Create a presentation outline for:",
    "Draft a project proposal for:",
    "Analyze the business case for:",
  ],
  Educational: [
    "Explain the concept of:",
    "What is the difference between:",
    "Teach me how to:",
    "Create a study guide for:",
  ],
};

function PresetCard({
  preset,
  onEdit,
  onDelete,
  onDuplicate,
}: {
  preset: ConversationPreset;
  onEdit: (preset: ConversationPreset) => void;
  onDelete: (id: string) => void;
  onDuplicate: (preset: ConversationPreset) => void;
}) {
  return (
    <Card className="relative">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base">{preset.name}</CardTitle>
            <CardDescription className="mt-1 text-sm">{preset.description}</CardDescription>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={() => onEdit(preset)}>
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onDuplicate(preset)}>
              <Upload className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(preset.id)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex flex-wrap gap-1">
            {preset.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {preset.isPublic && (
              <Badge variant="secondary" className="text-xs">
                <Globe className="mr-1 h-3 w-3" />
                Public
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-neutral-500">Model:</span>
              <div className="font-mono text-xs">{preset.model}</div>
            </div>
            <div>
              <span className="text-neutral-500">Temperature:</span>
              <div>{preset.temperature}</div>
            </div>
            <div>
              <span className="text-neutral-500">Max Tokens:</span>
              <div>{preset.maxTokens}</div>
            </div>
            <div>
              <span className="text-neutral-500">Starters:</span>
              <div>{preset.starterPrompts.length}</div>
            </div>
          </div>

          {preset.systemPrompt && (
            <div className="text-sm">
              <span className="text-neutral-500">System Prompt:</span>
              <div className="mt-1 rounded bg-neutral-50 p-2 font-mono text-xs dark:bg-neutral-900">
                {preset.systemPrompt.slice(0, 100)}
                {preset.systemPrompt.length > 100 && "..."}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"general" | "presets" | "api">("general");
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [presets, setPresets] = useState<ConversationPreset[]>([]);
  const [editingPreset, setEditingPreset] = useState<ConversationPreset | null>(null);
  const [showPresetDialog, setShowPresetDialog] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const toasts = useToasts();

  useEffect(() => {
    loadSettings();
    loadPresets();
    loadApiKey();
  }, []);

  const loadSettings = () => {
    try {
      const saved = localStorage.getItem("app-settings");
      if (saved) {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(saved) });
      }
    } catch {
      console.warn("Failed to load settings:", error);
    }
  };

  const saveSettings = (newSettings: AppSettings) => {
    try {
      localStorage.setItem("app-settings", JSON.stringify(newSettings));
      setSettings(newSettings);
      toasts.push({
        kind: "success",
        title: "Settings Saved",
        message: "Your preferences have been updated.",
      });
    } catch {
      toasts.push({
        kind: "error",
        title: "Save Failed",
        message: "Could not save settings. Please try again.",
      });
    }
  };

  const loadPresets = () => {
    try {
      const saved = localStorage.getItem("conversation-presets");
      if (saved) {
        setPresets(JSON.parse(saved));
      }
    } catch {
      console.warn("Failed to load presets:", error);
    }
  };

  const savePresets = (newPresets: ConversationPreset[]) => {
    try {
      localStorage.setItem("conversation-presets", JSON.stringify(newPresets));
      setPresets(newPresets);
    } catch {
      toasts.push({
        kind: "error",
        title: "Save Failed",
        message: "Could not save presets. Please try again.",
      });
    }
  };

  const loadApiKey = () => {
    try {
      const key = sessionStorage.getItem("openrouter-key") || "";
      setApiKey(key);
    } catch {
      console.warn("Failed to load API key:", error);
    }
  };

  const saveApiKey = (key: string) => {
    try {
      if (key.trim()) {
        sessionStorage.setItem("openrouter-key", key.trim());
      } else {
        sessionStorage.removeItem("openrouter-key");
      }
      setApiKey(key);
      toasts.push({
        kind: "success",
        title: "API Key Saved",
        message: "Your OpenRouter API key has been updated.",
      });
    } catch {
      toasts.push({
        kind: "error",
        title: "Save Failed",
        message: "Could not save API key. Please try again.",
      });
    }
  };

  const handleCreatePreset = () => {
    const newPreset: ConversationPreset = {
      ...DEFAULT_PRESET,
      id: `preset-${Date.now()}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setEditingPreset(newPreset);
    setShowPresetDialog(true);
  };

  const handleEditPreset = (preset: ConversationPreset) => {
    setEditingPreset(preset);
    setShowPresetDialog(true);
  };

  const handleSavePreset = (preset: ConversationPreset) => {
    const isNew = !presets.find((p) => p.id === preset.id);
    const updatedPreset = {
      ...preset,
      updatedAt: Date.now(),
      ...(isNew ? { createdAt: Date.now() } : {}),
    };

    const newPresets = isNew
      ? [...presets, updatedPreset]
      : presets.map((p) => (p.id === preset.id ? updatedPreset : p));

    savePresets(newPresets);
    setShowPresetDialog(false);
    setEditingPreset(null);

    toasts.push({
      kind: "success",
      title: isNew ? "Preset Created" : "Preset Updated",
      message: `"${preset.name}" has been saved.`,
    });
  };

  const handleDeletePreset = (id: string) => {
    if (window.confirm("Are you sure you want to delete this preset?")) {
      const newPresets = presets.filter((p) => p.id !== id);
      savePresets(newPresets);
      toasts.push({
        kind: "success",
        title: "Preset Deleted",
        message: "The preset has been removed.",
      });
    }
  };

  const handleDuplicatePreset = (preset: ConversationPreset) => {
    const duplicate: ConversationPreset = {
      ...preset,
      id: `preset-${Date.now()}`,
      name: `${preset.name} (Copy)`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    const newPresets = [...presets, duplicate];
    savePresets(newPresets);
    toasts.push({
      kind: "success",
      title: "Preset Duplicated",
      message: `"${duplicate.name}" has been created.`,
    });
  };

  const exportPresets = () => {
    try {
      const dataStr = JSON.stringify(presets, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "disa-presets.json";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toasts.push({
        kind: "success",
        title: "Presets Exported",
        message: "Your presets have been downloaded.",
      });
    } catch {
      toasts.push({
        kind: "error",
        title: "Export Failed",
        message: "Could not export presets. Please try again.",
      });
    }
  };

  const importPresets = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        if (Array.isArray(imported)) {
          const validPresets = imported.filter(
            (preset) => preset.id && preset.name && typeof preset.systemPrompt === "string",
          );
          const newPresets = [...presets, ...validPresets];
          savePresets(newPresets);
          toasts.push({
            kind: "success",
            title: "Presets Imported",
            message: `Imported ${validPresets.length} preset(s).`,
          });
        }
      } catch {
        toasts.push({
          kind: "error",
          title: "Import Failed",
          message: "Invalid preset file format.",
        });
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Settings</h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Manage your preferences and conversation presets
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6 flex space-x-1 rounded-lg bg-neutral-100 p-1 dark:bg-neutral-800">
        {[
          { id: "general", label: "General", icon: Settings },
          { id: "presets", label: "Presets", icon: Zap },
          { id: "api", label: "API Keys", icon: Key },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as any)}
            className={cn(
              "flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors",
              activeTab === id
                ? "bg-white text-neutral-900 shadow-sm dark:bg-neutral-900 dark:text-neutral-100"
                : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100",
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {/* General Settings */}
      {activeTab === "general" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="theme">Theme</Label>
                  <Select
                    value={settings.theme}
                    onValueChange={(value: "light" | "dark" | "system") =>
                      saveSettings({ ...settings, theme: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="fontSize">Font Size</Label>
                  <Select
                    value={settings.fontSize}
                    onValueChange={(value: "small" | "medium" | "large") =>
                      saveSettings({ ...settings, fontSize: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="sounds">Sound Effects</Label>
                  <p className="text-sm text-neutral-500">
                    Play sounds for notifications and actions
                  </p>
                </div>
                <Switch
                  id="sounds"
                  checked={settings.enableSounds}
                  onChange={(checked: boolean) =>
                    saveSettings({ ...settings, enableSounds: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notifications">Notifications</Label>
                  <p className="text-sm text-neutral-500">Receive browser notifications</p>
                </div>
                <Switch
                  id="notifications"
                  checked={settings.enableNotifications}
                  onChange={(checked: boolean) =>
                    saveSettings({ ...settings, enableNotifications: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="autosave">Auto-save Conversations</Label>
                  <p className="text-sm text-neutral-500">
                    Automatically save conversation history
                  </p>
                </div>
                <Switch
                  id="autosave"
                  checked={settings.autoSave}
                  onChange={(checked: boolean) => saveSettings({ ...settings, autoSave: checked })}
                />
              </div>

              <div>
                <Label htmlFor="maxHistory">Max Message History</Label>
                <Input
                  id="maxHistory"
                  type="number"
                  min="10"
                  max="1000"
                  value={settings.maxMessageHistory}
                  onChange={(e) =>
                    saveSettings({
                      ...settings,
                      maxMessageHistory: parseInt(e.target.value) || 100,
                    })
                  }
                  className="mt-1"
                />
                <p className="mt-1 text-sm text-neutral-500">
                  Maximum number of messages to keep in conversation history
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Presets */}
      {activeTab === "presets" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Conversation Presets</h2>
              <p className="text-neutral-600 dark:text-neutral-400">
                Save and reuse conversation settings and starter prompts
              </p>
            </div>
            <div className="flex gap-2">
              <input
                type="file"
                accept=".json"
                onChange={importPresets}
                className="hidden"
                id="import-presets"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => document.getElementById("import-presets")?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                Import
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={exportPresets}
                disabled={presets.length === 0}
              >
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button onClick={handleCreatePreset}>
                <Plus className="mr-2 h-4 w-4" />
                New Preset
              </Button>
            </div>
          </div>

          {presets.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Zap className="mb-4 h-12 w-12 text-neutral-400" />
                <h3 className="mb-2 text-lg font-medium text-neutral-600 dark:text-neutral-400">
                  No presets yet
                </h3>
                <p className="mb-4 text-center text-neutral-500">
                  Create your first conversation preset to save time and ensure consistency
                </p>
                <Button onClick={handleCreatePreset}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Preset
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {presets.map((preset) => (
                <PresetCard
                  key={preset.id}
                  preset={preset}
                  onEdit={handleEditPreset}
                  onDelete={handleDeletePreset}
                  onDuplicate={handleDuplicatePreset}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* API Keys */}
      {activeTab === "api" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                OpenRouter API Key
              </CardTitle>
              <CardDescription>
                Your API key is stored securely in your browser and never sent to our servers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="apiKey">API Key</Label>
                <div className="mt-1 flex gap-2">
                  <Input
                    id="apiKey"
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-or-..."
                    className="font-mono"
                  />
                  <Button onClick={() => saveApiKey(apiKey)}>
                    <Save className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-start gap-2 rounded-lg bg-blue-50 p-3 dark:bg-blue-950">
                <Shield className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
                <div className="text-sm">
                  <div className="font-medium text-blue-900 dark:text-blue-100">
                    Security Notice
                  </div>
                  <div className="text-blue-700 dark:text-blue-200">
                    Your API key is stored locally and encrypted. It's only used to make requests to
                    OpenRouter on your behalf. You can get your API key from{" "}
                    <a
                      href="https://openrouter.ai/keys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      OpenRouter
                    </a>
                    .
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Preset Dialog */}
      <Dialog open={showPresetDialog} onOpenChange={setShowPresetDialog}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPreset?.name ? "Edit Preset" : "Create New Preset"}</DialogTitle>
            <DialogDescription>
              Configure your conversation preset with model settings and starter prompts
            </DialogDescription>
          </DialogHeader>

          {editingPreset && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="presetName">Name</Label>
                  <Input
                    id="presetName"
                    value={editingPreset.name}
                    onChange={(e) => setEditingPreset({ ...editingPreset, name: e.target.value })}
                    placeholder="My Preset"
                  />
                </div>

                <div>
                  <Label htmlFor="presetModel">Model</Label>
                  <Input
                    id="presetModel"
                    value={editingPreset.model}
                    onChange={(e) => setEditingPreset({ ...editingPreset, model: e.target.value })}
                    placeholder="meta-llama/llama-3.3-70b-instruct:free"
                    className="font-mono"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="presetDescription">Description</Label>
                <Input
                  id="presetDescription"
                  value={editingPreset.description}
                  onChange={(e) =>
                    setEditingPreset({ ...editingPreset, description: e.target.value })
                  }
                  placeholder="Describe what this preset is for..."
                />
              </div>

              <div>
                <Label htmlFor="presetSystemPrompt">System Prompt</Label>
                <Textarea
                  id="presetSystemPrompt"
                  value={editingPreset.systemPrompt}
                  onChange={(e) =>
                    setEditingPreset({ ...editingPreset, systemPrompt: e.target.value })
                  }
                  placeholder="You are a helpful AI assistant..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="presetTemperature">Temperature</Label>
                  <Input
                    id="presetTemperature"
                    type="number"
                    min="0"
                    max="2"
                    step="0.1"
                    value={editingPreset.temperature}
                    onChange={(e) =>
                      setEditingPreset({
                        ...editingPreset,
                        temperature: parseFloat(e.target.value) || 0.7,
                      })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="presetMaxTokens">Max Tokens</Label>
                  <Input
                    id="presetMaxTokens"
                    type="number"
                    min="1"
                    max="8192"
                    value={editingPreset.maxTokens}
                    onChange={(e) =>
                      setEditingPreset({
                        ...editingPreset,
                        maxTokens: parseInt(e.target.value) || 2048,
                      })
                    }
                  />
                </div>
              </div>

              <div>
                <Label>Starter Prompts</Label>
                <div className="mt-2 space-y-2">
                  {editingPreset.starterPrompts.map((prompt, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={prompt}
                        onChange={(e) => {
                          const newPrompts = [...editingPreset.starterPrompts];
                          newPrompts[index] = e.target.value;
                          setEditingPreset({ ...editingPreset, starterPrompts: newPrompts });
                        }}
                        placeholder="Enter a starter prompt..."
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newPrompts = editingPreset.starterPrompts.filter(
                            (_, i) => i !== index,
                          );
                          setEditingPreset({ ...editingPreset, starterPrompts: newPrompts });
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={() =>
                      setEditingPreset({
                        ...editingPreset,
                        starterPrompts: [...editingPreset.starterPrompts, ""],
                      })
                    }
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Starter Prompt
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="presetTags">Tags (comma-separated)</Label>
                <Input
                  id="presetTags"
                  value={editingPreset.tags.join(", ")}
                  onChange={(e) =>
                    setEditingPreset({
                      ...editingPreset,
                      tags: e.target.value
                        .split(",")
                        .map((tag) => tag.trim())
                        .filter(Boolean),
                    })
                  }
                  placeholder="creative, professional, educational"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="presetPublic"
                  checked={editingPreset.isPublic}
                  onChange={(checked: boolean) =>
                    setEditingPreset({ ...editingPreset, isPublic: checked })
                  }
                />
                <Label htmlFor="presetPublic">Make this preset public</Label>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowPresetDialog(false);
                    setEditingPreset(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleSavePreset(editingPreset)}
                  disabled={!editingPreset.name.trim()}
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Preset
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
