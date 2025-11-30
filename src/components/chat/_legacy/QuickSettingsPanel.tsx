import { useState } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/ui/Button";

import { useSettings } from "../../hooks/useSettings";
import { ChevronDown, ChevronUp, Settings, SlidersHorizontal } from "../../lib/icons";

interface QuickSettingsPanelProps {
  className?: string;
}

export function QuickSettingsPanel({ className }: QuickSettingsPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { settings, setCreativity, setPreferredModel } = useSettings();

  // Get current values for display
  const creativity = settings.creativity ?? 45;
  const currentModel = settings.preferredModelId || "claude-3.5-sonnet";

  const creativityLabel =
    creativity < 25
      ? "Faktisch"
      : creativity < 50
        ? "Ausgewogen"
        : creativity < 75
          ? "Kreativ"
          : "Experimentell";

  const handleCreativityChange = (value: number) => {
    setCreativity(value);
  };

  const modelOptions = [
    { id: "claude-3.5-sonnet", label: "Claude 3.5 Sonnet", description: "Schnell & Smart" },
    { id: "claude-3-opus", label: "Claude 3 Opus", description: "Präzise & Tiefgreifend" },
    { id: "gpt-4", label: "GPT-4", description: "Vielseitig" },
    { id: "gpt-3.5-turbo", label: "GPT-3.5 Turbo", description: "Schnell & Günstig" },
  ];

  const currentModelOption = modelOptions.find((m) => m.id === currentModel) ?? modelOptions[0];
  if (!currentModelOption) return null;

  return (
    <div className={cn("bg-surface-2/50 rounded-xl border border-surface-1", className)}>
      {/* Header - Always Visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 text-left hover:bg-surface-2/70 rounded-xl transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-md bg-brand/10 flex items-center justify-center">
            <SlidersHorizontal className="h-3 w-3 text-brand" />
          </div>
          <span className="text-sm font-medium text-text-primary">Schnelleinstellungen</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-text-secondary" />
        ) : (
          <ChevronDown className="h-4 w-4 text-text-secondary" />
        )}
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-3 pb-3 space-y-3">
          {/* Current Status Display */}
          <div className="text-xs text-text-secondary space-y-1">
            <div className="flex justify-between">
              <span>Modell:</span>
              <span className="font-medium text-text-primary">{currentModelOption.label}</span>
            </div>
            <div className="flex justify-between">
              <span>Kreativität:</span>
              <span className="font-medium text-text-primary">
                {creativityLabel} ({creativity}%)
              </span>
            </div>
          </div>

          {/* Creativity Quick Slider */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-text-secondary">Kreativität</label>
            <div className="space-y-1">
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={creativity}
                onChange={(e) => handleCreativityChange(parseInt(e.target.value))}
                className="w-full h-1 bg-surface-1 rounded-lg appearance-none cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand [&::-webkit-slider-thumb]:cursor-pointer
                  [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:rounded-full
                  [&::-moz-range-thumb]:bg-brand [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-0"
              />
              <div className="flex justify-between text-[10px] text-text-tertiary">
                <span>Faktisch</span>
                <span>Experimentell</span>
              </div>
            </div>
          </div>

          {/* Model Quick Select */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-text-secondary">Modell</label>
            <div className="grid grid-cols-2 gap-1">
              {modelOptions.slice(0, 4).map((model) => (
                <button
                  key={model.id}
                  onClick={() => setPreferredModel(model.id)}
                  className={cn(
                    "p-2 rounded-lg text-xs text-left transition-all",
                    currentModel === model.id
                      ? "bg-brand/10 border border-brand/20 text-brand"
                      : "bg-surface-1 hover:bg-surface-2 text-text-secondary hover:text-text-primary",
                  )}
                >
                  <div className="font-medium truncate">
                    {model.label.replace(/Claude |GPT-/, "")}
                  </div>
                  <div className="text-[10px] opacity-75 truncate">{model.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="pt-1 border-t border-surface-1">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2 text-xs h-8"
              onClick={() => {
                // Navigate to full settings (could be implemented as navigation)
                // TODO: Implement navigation to settings page
              }}
            >
              <Settings className="h-3 w-3" />
              Alle Einstellungen
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
