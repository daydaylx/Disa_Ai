import { useState } from "react";
import { ChevronDown, Zap } from "@/lib/icons";
import { Button } from "@/ui/Button";
import { MaterialCard } from "@/ui/MaterialCard";
import { cn } from "@/lib/utils";

interface Model {
  id: string;
  name: string;
  description?: string;
  isFree?: boolean;
  isPremium?: boolean;
}

interface ModelSelectorProps {
  currentModelId: string;
  onModelChange: (modelId: string) => void;
  className?: string;
}

// Quick list of common models - full list can be loaded dynamically
const COMMON_MODELS: Model[] = [
  {
    id: "meta-llama/llama-3.3-70b-instruct:free",
    name: "Llama 3.3 70B",
    description: "Schnell & kostenlos",
    isFree: true,
  },
  {
    id: "cognitivecomputations/dolphin-mistral-24b-venice-edition:free",
    name: "Dolphin Mistral 24B",
    description: "Kreativ & frei",
    isFree: true,
  },
  {
    id: "openai/gpt-4o-mini",
    name: "GPT-4o Mini",
    description: "OpenAI, ausgewogen",
  },
  {
    id: "openai/gpt-4o",
    name: "GPT-4o",
    description: "OpenAI, leistungsstark",
    isPremium: true,
  },
  {
    id: "anthropic/claude-3.5-sonnet",
    name: "Claude 3.5 Sonnet",
    description: "Anthropic, präzise",
    isPremium: true,
  },
  {
    id: "google/gemini-2.0-flash-exp:free",
    name: "Gemini 2.0 Flash",
    description: "Google, experimentell",
    isFree: true,
  },
];

export function ModelSelector({ currentModelId, onModelChange, className }: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const currentModel = COMMON_MODELS.find((m) => m.id === currentModelId) || {
    id: currentModelId,
    name: currentModelId.split("/").pop() || currentModelId,
    description: "",
  };

  const handleSelect = (modelId: string) => {
    onModelChange(modelId);
    setIsOpen(false);
  };

  return (
    <div className={cn("relative", className)}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="h-auto py-1.5 px-3 text-xs font-semibold text-text-primary bg-surface-inset hover:bg-surface-hover flex items-center gap-2"
      >
        <span className="truncate max-w-[150px] sm:max-w-[200px]">{currentModel.name}</span>
        <ChevronDown className={cn("h-3 w-3 transition-transform", isOpen && "rotate-180")} />
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-30"
            onClick={() => setIsOpen(false)}
            data-testid="model-selector-backdrop"
          />

          {/* Dropdown */}
          <MaterialCard
            variant="raised"
            className="absolute top-full left-0 mt-2 w-[280px] sm:w-[320px] max-h-[60vh] overflow-y-auto z-40 p-2"
            data-testid="model-selector-dropdown"
          >
            <div className="space-y-1">
              {COMMON_MODELS.map((model) => {
                const isActive = model.id === currentModelId;

                return (
                  <button
                    key={model.id}
                    onClick={() => handleSelect(model.id)}
                    className={cn(
                      "w-full text-left px-3 py-2.5 rounded-lg transition-colors",
                      "hover:bg-surface-hover",
                      isActive && "bg-accent-primary/10 ring-1 ring-accent-primary/30",
                    )}
                    data-testid={`model-option-${model.id}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "text-sm font-semibold truncate",
                              isActive ? "text-accent-primary" : "text-text-primary",
                            )}
                          >
                            {model.name}
                          </span>
                          {model.isFree && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-400">
                              FREE
                            </span>
                          )}
                          {model.isPremium && (
                            <Zap className="h-3 w-3 text-amber-400 flex-shrink-0" />
                          )}
                        </div>
                        {model.description && (
                          <p className="text-xs text-text-secondary mt-0.5">{model.description}</p>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Footer with link to full models page */}
            <div className="mt-2 pt-2 border-t border-surface-2">
              <button
                onClick={() => {
                  setIsOpen(false);
                  // Navigate to settings where models can be configured
                  window.location.href = "/settings/api-data";
                }}
                className="w-full text-left px-3 py-2 text-xs text-text-secondary hover:text-text-primary hover:bg-surface-hover rounded-lg transition-colors"
              >
                Alle Modelle ansehen →
              </button>
            </div>
          </MaterialCard>
        </>
      )}
    </div>
  );
}
