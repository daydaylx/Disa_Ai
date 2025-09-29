import React, { useState } from "react";

import BottomSheet from "../components/ui/BottomSheet";
import type { Model } from "./types";

interface ModelSheetProps {
  open: boolean;
  onClose: () => void;
  onSelect: (model: Model) => void;
  currentId: string;
  models: Model[];
}

export default function ModelSheet({
  open,
  onClose,
  onSelect,
  currentId,
  models,
}: ModelSheetProps) {
  const [selectedId, setSelectedId] = useState(currentId);

  const handleSelect = (model: Model) => {
    setSelectedId(model.id);
    onSelect(model);
    onClose();
  };

  // Group models by provider for better organization
  const groupedModels = models.reduce(
    (acc, model) => {
      const provider = model.provider || "Weitere";
      if (!acc[provider]) acc[provider] = [];
      acc[provider].push(model);
      return acc;
    },
    {} as Record<string, Model[]>,
  );

  return (
    <BottomSheet open={open} title="Modell auswählen" onClose={onClose}>
      <div
        className="overflow-y-auto px-4 pb-4"
        style={{ maxHeight: "calc(var(--vh, 100dvh) * 0.6)" }}
      >
        <div className="space-y-6">
          {Object.entries(groupedModels).map(([provider, providerModels]) => (
            <div key={provider} className="space-y-3">
              <h3 className="text-text-muted text-sm font-semibold uppercase tracking-wider">
                {provider}
              </h3>
              <div className="space-y-2">
                {providerModels.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => handleSelect(model)}
                    className={`w-full rounded-xl border p-4 text-left transition-all duration-200 ${
                      selectedId === model.id
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:bg-bg-elevated/80 bg-bg-elevated text-text-default"
                    }`}
                    data-testid={`model-option-${model.id}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <h4 className="truncate font-medium">{model.label || model.id}</h4>
                        <div className="text-text-muted mt-1 flex items-center gap-4 text-sm">
                          {model.ctx && <span>{(model.ctx / 1000).toFixed(0)}k Token</span>}
                          {model.pricing?.in !== undefined && (
                            <span>
                              ${model.pricing.in === 0 ? "Kostenlos" : `$${model.pricing.in}/1k`}
                            </span>
                          )}
                        </div>
                      </div>
                      {selectedId === model.id && (
                        <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary">
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path
                              d="M10 3L4.5 8.5L2 6"
                              stroke="white"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {models.length === 0 && (
          <div className="text-text-muted py-8 text-center">
            <p>Keine Modelle verfügbar</p>
            <p className="mt-1 text-sm">Überprüfen Sie Ihre Internetverbindung</p>
          </div>
        )}
      </div>
    </BottomSheet>
  );
}
