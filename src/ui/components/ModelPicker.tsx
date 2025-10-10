import { useEffect, useState } from "react";

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

  // Close dropdown on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

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

  const getTagColor = (tag: string): string => {
    const colors: Record<string, string> = {
      recommended: "bg-[hsl(var(--accent-primary)/0.2)] text-[hsl(var(--accent-primary))]",
      premium: "bg-[hsl(var(--accent-secondary)/0.2)] text-[hsl(var(--accent-secondary))]",
      budget: "bg-green-500/20 text-green-400",
      fast: "bg-blue-500/20 text-blue-400",
      "open-source": "bg-purple-500/20 text-purple-400",
      coding: "bg-orange-500/20 text-orange-400",
      multimodal: "bg-pink-500/20 text-pink-400",
      "long-context": "bg-yellow-500/20 text-yellow-400",
    };
    return colors[tag] || "bg-gray-500/20 text-gray-400";
  };

  return (
    <div className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-lg border border-[hsl(var(--text-muted)/0.2)] bg-[hsl(var(--bg-base)/0.8)] px-3 py-2 text-left text-sm backdrop-blur-sm transition-all hover:border-[hsl(var(--accent-primary)/0.4)] hover:bg-[hsl(var(--bg-base)/0.9)]"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <div className="flex items-center gap-2">
          <span className="font-medium text-[hsl(var(--text-main))]">
            {selectedModel?.label || "Modell wählen"}
          </span>
          {selectedModel && (
            <div className="flex items-center gap-1 text-xs text-[hsl(var(--text-muted))]">
              <span>•</span>
              <span>{formatContext(selectedModel.context)}</span>
              <span>•</span>
              <span>{formatPrice(selectedModel.inputPrice)}</span>
            </div>
          )}
        </div>
        <svg
          className={`h-4 w-4 text-[hsl(var(--text-muted))] transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <button
            type="button"
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setIsOpen(false)}
            aria-label="Modell-Auswahl schließen"
            tabIndex={-1}
          />

          {/* Menu */}
          <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-96 overflow-y-auto rounded-lg border border-[hsl(var(--text-muted)/0.2)] bg-[hsl(var(--bg-base)/0.95)] p-1 backdrop-blur-xl">
            {Object.entries(groupedModels).map(([provider, models]) => (
              <div key={provider} className="mb-2 last:mb-0">
                {/* Provider Header */}
                <div className="px-2 py-1 text-xs font-semibold uppercase tracking-wide text-[hsl(var(--text-muted))]">
                  {getProviderName(provider)}
                </div>

                {/* Models */}
                {models.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => handleModelSelect(model.id)}
                    className={`group w-full rounded-md p-2 text-left transition-all hover:bg-[hsl(var(--accent-primary)/0.1)] ${
                      model.id === selectedModelId
                        ? "bg-[hsl(var(--accent-primary)/0.15)] ring-1 ring-[hsl(var(--accent-primary)/0.3)]"
                        : ""
                    }`}
                    role="option"
                    aria-selected={model.id === selectedModelId}
                  >
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 text-sm font-medium text-[hsl(var(--text-main))]">
                          {model.label}
                        </div>

                        {/* Model Details */}
                        <div className="mb-1 flex items-center gap-3 text-xs text-[hsl(var(--text-muted))]">
                          <span>Context: {formatContext(model.context)}</span>
                          <span>•</span>
                          <span>In: {formatPrice(model.inputPrice)}</span>
                          <span>•</span>
                          <span>Out: {formatPrice(model.outputPrice)}</span>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1">
                          {model.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${getTagColor(tag)}`}
                            >
                              {tag}
                            </span>
                          ))}
                          {model.tags.length > 3 && (
                            <span className="rounded bg-gray-500/20 px-1.5 py-0.5 text-[10px] font-medium text-gray-400">
                              +{model.tags.length - 3}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Selection Indicator */}
                      {model.id === selectedModelId && (
                        <div className="ml-2 flex-shrink-0">
                          <svg
                            className="h-4 w-4 text-[hsl(var(--accent-primary))]"
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
