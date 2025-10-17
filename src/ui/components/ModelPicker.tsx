import { useState } from "react";

import { Badge } from "@/components/ui/badge";

import type { AIModel } from "../../data/models";
import { formatContext, formatPrice, getModelById, MODELS } from "../../data/models";

interface ModelPickerProps {
  selectedModelId: string;
  onModelChange: (modelId: string) => void;
  className?: string;
}

export function ModelPicker({ selectedModelId, onModelChange, className = "" }: ModelPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedModel = getModelById(selectedModelId);

  const handleModelSelect = (modelId: string) => {
    onModelChange(modelId);
    setIsOpen(false);
  };

  const groupedModels = MODELS.reduce<Record<string, AIModel[]>>((acc, model) => {
    const provider = model.id.split("/")[0] ?? "other";
    const group = acc[provider] ?? [];
    group.push(model);
    acc[provider] = group;
    return acc;
  }, {});

  const getProviderName = (provider: string): string => {
    const names: Record<string, string> = {
      anthropic: "Anthropic",
      openai: "OpenAI",
      google: "Google",
      "meta-llama": "Meta",
      mistralai: "Mistral",
    };
    return names[provider] || provider;
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="border-border bg-surface-1 hover:border-brand flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-sm transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <div className="flex items-center gap-2">
          <span className="text-text-0 font-medium">{selectedModel?.label || "Modell wählen"}</span>
          {selectedModel && (
            <div className="text-text-1 flex items-center gap-1 text-xs">
              <span>•</span>
              <span>{formatContext(selectedModel.context)}</span>
              <span>•</span>
              <span>{formatPrice(selectedModel.inputPrice)}</span>
            </div>
          )}
        </div>
        <svg
          className={`text-text-1 h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

          <div className="border-border bg-surface-1 absolute left-0 right-0 top-full z-50 mt-1 max-h-96 overflow-y-auto rounded-lg border p-1">
            {Object.entries(groupedModels).map(([provider, models]) => (
              <div key={provider} className="mb-2 last:mb-0">
                <div className="text-text-1 px-2 py-1 text-xs font-semibold uppercase tracking-wide">
                  {getProviderName(provider)}
                </div>

                {models.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => handleModelSelect(model.id)}
                    className={`hover:bg-surface-2 group w-full rounded-md p-2 text-left transition-all ${
                      model.id === selectedModelId ? "bg-surface-2 ring-brand ring-1" : ""
                    }`}
                    role="option"
                    aria-selected={model.id === selectedModelId}
                  >
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="text-text-0 mb-1 text-sm font-medium">{model.label}</div>

                        <div className="text-text-1 mb-1 flex items-center gap-3 text-xs">
                          <span>Context: {formatContext(model.context)}</span>
                          <span>•</span>
                          <span>In: {formatPrice(model.inputPrice)}</span>
                          <span>•</span>
                          <span>Out: {formatPrice(model.outputPrice)}</span>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {model.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                          {model.tags.length > 3 && (
                            <Badge variant="secondary">+{model.tags.length - 3}</Badge>
                          )}
                        </div>
                      </div>

                      {model.id === selectedModelId && (
                        <div className="ml-2 flex-shrink-0">
                          <svg
                            className="text-brand h-4 w-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
