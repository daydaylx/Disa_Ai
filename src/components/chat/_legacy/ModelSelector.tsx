import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { LegacyModelOption } from "@/config/modelPresets";
import { ChevronDown, Zap } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/Button";
import { MaterialCard } from "@/ui/MaterialCard";

import { useLegacyModelOptions } from "./useLegacyModelOptions";

interface ModelSelectorProps {
  currentModelId: string;
  onModelChange: (modelId: string) => void;
  className?: string;
  models?: LegacyModelOption[];
}
export function ModelSelector({
  currentModelId,
  onModelChange,
  className,
  models,
}: ModelSelectorProps) {
  const navigate = useNavigate();
  const { modelOptions } = useLegacyModelOptions();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const availableModels = models ?? modelOptions;

  const currentModel = availableModels.find((m) => m.id === currentModelId) || {
    id: currentModelId,
    label: currentModelId.split("/").pop() || currentModelId,
    description: "",
  };

  const handleSelect = (modelId: string) => {
    onModelChange(modelId);
    setIsOpen(false);
    // Return focus to button after selection
    buttonRef.current?.focus();
  };

  // Handle Escape key to close dropdown
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
    return undefined;
  }, [isOpen]);

  return (
    <div className={cn("relative", className)}>
      <Button
        ref={buttonRef}
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={`Modell auswählen. Aktuell: ${currentModel.label}`}
        className="h-auto py-1.5 px-3 text-xs font-semibold text-text-primary bg-surface-inset hover:bg-surface-hover flex items-center gap-2"
      >
        <span className="truncate max-w-[150px] sm:max-w-[200px]">{currentModel.label}</span>
        <ChevronDown className={cn("h-3 w-3 transition-transform", isOpen && "rotate-180")} />
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-modal-backdrop"
            onClick={() => setIsOpen(false)}
            data-testid="model-selector-backdrop"
          />

          {/* Dropdown */}
          <MaterialCard
            ref={dropdownRef}
            variant="raised"
            role="listbox"
            aria-label="Verfügbare Modelle"
            className="absolute top-full left-0 mt-2 w-[280px] sm:w-[320px] max-h-[60vh] overflow-y-auto z-dropdown p-2"
            data-testid="model-selector-dropdown"
          >
            <div className="space-y-1">
              {availableModels.map((model) => {
                const isActive = model.id === currentModelId;

                return (
                  <button
                    key={model.id}
                    role="option"
                    aria-selected={isActive}
                    onClick={() => handleSelect(model.id)}
                    className={cn(
                      "w-full text-left px-3 py-2.5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-accent-primary",
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
                            {model.label}
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
                  // Navigate to settings where models can be configured without full reload
                  void navigate("/settings/api-data");
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
