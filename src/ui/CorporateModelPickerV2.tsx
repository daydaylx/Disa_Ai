import React, { useState } from "react";

import type { Model } from "./types";

interface CorporateModelPickerV2Props {
  open: boolean;
  onClose: () => void;
  onSelect: (model: Model) => void;
  currentId: string;
  models: Model[];
}

export default function CorporateModelPickerV2({
  open,
  onClose,
  onSelect,
  currentId,
  models,
}: CorporateModelPickerV2Props) {
  const [selectedId, setSelectedId] = useState(currentId);

  const handleSelect = (model: Model) => {
    setSelectedId(model.id);
    onSelect(model);
    onClose();
  };

  // Group models by provider for better organization
  const groupedModels = models.reduce(
    (acc, model) => {
      const provider = model.provider || "Other";
      if (!acc[provider]) acc[provider] = [];
      acc[provider].push(model);
      return acc;
    },
    {} as Record<string, Model[]>,
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 backdrop-blur-sm"
        style={{ backgroundColor: "rgba(0, 7, 17, 0.8)" }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative mx-4 max-h-[80vh] w-full max-w-2xl overflow-hidden rounded-2xl border"
        style={{
          backgroundColor: "var(--corp-bg-elevated)",
          borderColor: "var(--corp-border-primary)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between border-b p-6"
          style={{ borderColor: "var(--corp-border-primary)" }}
        >
          <div>
            <h2 className="text-xl font-semibold" style={{ color: "var(--corp-text-primary)" }}>
              AI Model Selection
            </h2>
            <p className="mt-1 text-sm" style={{ color: "var(--corp-text-secondary)" }}>
              Choose your preferred AI model for business intelligence
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-12 w-12 items-center justify-center rounded-lg border transition-colors hover:bg-opacity-80"
            style={{
              borderColor: "var(--corp-border-secondary)",
              backgroundColor: "var(--corp-bg-card)",
              color: "var(--corp-text-muted)",
            }}
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
        <div className="max-h-[60vh] overflow-y-auto p-6">
          <div className="space-y-6">
            {Object.entries(groupedModels).map(([provider, providerModels]) => (
              <div key={provider} className="space-y-3">
                <h3
                  className="text-sm font-semibold uppercase tracking-wider"
                  style={{ color: "var(--corp-text-muted)" }}
                >
                  {provider}
                </h3>
                <div className="space-y-2">
                  {providerModels.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => handleSelect(model)}
                      className={`w-full rounded-xl border p-4 text-left transition-all hover:scale-[1.02] ${
                        selectedId === model.id ? "corp-ring-primary ring-2 ring-opacity-50" : ""
                      }`}
                      style={{
                        backgroundColor:
                          selectedId === model.id ? "var(--corp-bg-card)" : "transparent",
                        borderColor:
                          selectedId === model.id
                            ? "var(--corp-accent-primary)"
                            : "var(--corp-border-secondary)",
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h4
                              className="font-medium"
                              style={{ color: "var(--corp-text-primary)" }}
                            >
                              {model.label}
                            </h4>
                            {selectedId === model.id && (
                              <div
                                className="flex h-5 w-5 items-center justify-center rounded-full"
                                style={{ backgroundColor: "var(--corp-accent-primary)" }}
                              >
                                <svg
                                  width="12"
                                  height="12"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="white"
                                  strokeWidth="3"
                                >
                                  <path d="M20 6 9 17l-5-5" />
                                </svg>
                              </div>
                            )}
                          </div>

                          {/* Description not available in ModelEntry interface */}

                          <div className="mt-3 flex flex-wrap gap-2">
                            {model.ctx && (
                              <span
                                className="rounded-full px-2 py-1 text-xs font-medium"
                                style={{
                                  backgroundColor: "var(--corp-bg-primary)",
                                  color: "var(--corp-text-accent)",
                                }}
                              >
                                {model.ctx.toLocaleString()} tokens
                              </span>
                            )}

                            {model.pricing?.in && (
                              <span
                                className="rounded-full px-2 py-1 text-xs font-medium"
                                style={{
                                  backgroundColor: "var(--corp-bg-primary)",
                                  color: "var(--corp-text-accent)",
                                }}
                              >
                                ${model.pricing.in.toFixed(4)}/1K
                              </span>
                            )}

                            {model.tags?.map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full px-2 py-1 text-xs font-medium"
                                style={{
                                  backgroundColor: "var(--corp-bg-primary)",
                                  color: "var(--corp-text-muted)",
                                }}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
