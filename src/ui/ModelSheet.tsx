import { useEffect, useMemo, useRef, useState } from "react";

import BottomSheet from "../components/ui/BottomSheet";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [activeProvider, setActiveProvider] = useState<string>("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSelectedId(currentId);
  }, [currentId]);

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => {
      searchInputRef.current?.focus();
      searchInputRef.current?.select();
    }, 60);
    return () => window.clearTimeout(timer);
  }, [open]);

  const handleSelect = (model: Model) => {
    setSelectedId(model.id);
    onSelect(model);
    onClose();
  };

  const groupedModels = useMemo(() => {
    return models.reduce(
      (acc, model) => {
        const provider = model.provider || "Weitere";
        if (!acc[provider]) acc[provider] = [];
        acc[provider].push(model);
        return acc;
      },
      {} as Record<string, Model[]>,
    );
  }, [models]);

  const providerEntries = useMemo(
    () =>
      Object.entries(groupedModels)
        .map(
          ([provider, items]) =>
            [
              provider,
              [...items].sort((a, b) => (a.label ?? a.id).localeCompare(b.label ?? b.id)),
            ] as const,
        )
        .sort(([a], [b]) => a.localeCompare(b, "de-DE")),
    [groupedModels],
  );

  useEffect(() => {
    if (providerEntries.length === 0) {
      setActiveProvider("");
      return;
    }

    setActiveProvider((prev) => {
      if (!prev || !providerEntries.find(([provider]) => provider === prev)) {
        return providerEntries[0]?.[0] ?? prev;
      }
      return prev;
    });
  }, [providerEntries]);

  useEffect(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return;

    for (const [provider, providerModels] of providerEntries) {
      const hasMatch = providerModels.some((model) => {
        const haystack = [model.label ?? model.id, model.id, provider, ...(model.tags ?? [])]
          .join(" ")
          .toLowerCase();
        return haystack.includes(term);
      });
      if (hasMatch && provider !== activeProvider) {
        setActiveProvider(provider);
        break;
      }
    }
  }, [activeProvider, providerEntries, searchTerm]);

  return (
    <BottomSheet open={open} title="Modell auswählen" onClose={onClose}>
      <div
        className="overflow-y-auto px-4 pb-4"
        style={{ maxHeight: "calc(var(--vh, 100dvh) * 0.65)" }}
      >
        <div className="sticky top-0 z-10 -mx-4 mb-4 space-y-3 bg-surface-1 px-4 pb-3 pt-2">
          <Input
            ref={searchInputRef}
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Modelle durchsuchen"
            className="h-11 rounded-lg"
          />

          {providerEntries.length > 1 && (
            <div
              className="flex gap-2 overflow-x-auto pb-1"
              role="tablist"
              aria-label="Modelle nach Anbieter"
            >
              {providerEntries.map(([provider]) => {
                const isActive = provider === activeProvider;
                return (
                  <Button
                    key={provider}
                    variant={isActive ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setActiveProvider(provider)}
                  >
                    {provider}
                  </Button>
                );
              })}
            </div>
          )}
        </div>

        <div className="space-y-5">
          {providerEntries.map(([provider, providerModels]) => {
            const isVisible =
              provider === activeProvider ||
              (!activeProvider && providerEntries[0]?.[0] === provider);
            if (!isVisible) return null;

            const trimmedTerm = searchTerm.trim().toLowerCase();
            const filteredModels = providerModels.filter((model) => {
              if (!trimmedTerm) return true;
              const haystack = [model.label ?? model.id, model.id, provider, ...(model.tags ?? [])]
                .join(" ")
                .toLowerCase();
              return haystack.includes(trimmedTerm);
            });

            return (
              <section key={provider} aria-label={`Modelle von ${provider}`} className="space-y-3">
                <header className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-text-0">{provider}</h3>
                  <span className="text-xs text-text-1">{filteredModels.length} Modelle</span>
                </header>

                <div className="space-y-2">
                  {filteredModels.length === 0 ? (
                    <div className="rounded-lg border border-border bg-surface-1 px-4 py-6 text-center text-sm text-text-1">
                      Keine Treffer für „{searchTerm.trim()}“
                    </div>
                  ) : (
                    filteredModels.map((model) => {
                      const isSelected = selectedId === model.id;
                      return (
                        <button
                          key={model.id}
                          onClick={() => handleSelect(model)}
                          className={`w-full rounded-lg border border-border bg-surface-1 p-4 text-left transition-all duration-200 hover:bg-surface-2 ${isSelected ? "ring-2 ring-brand" : ""}`}
                          data-testid={`model-option-${model.id}`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0 flex-1">
                              <h4 className="break-words text-sm font-medium text-text-0">
                                {model.label || model.id}
                              </h4>
                              <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-text-1">
                                {model.ctx && (
                                  <span className="text-text-0">
                                    {(model.ctx / 1000).toFixed(0)}k Token
                                  </span>
                                )}
                                {model.pricing?.in !== undefined && (
                                  <span className="text-text-0">
                                    {model.pricing.in === 0
                                      ? "Kostenlos"
                                      : `$${model.pricing.in}/1k`}
                                  </span>
                                )}
                                {model.tags.length > 0 && (
                                  <span className="break-words text-text-1">
                                    {model.tags.join(" • ")}
                                  </span>
                                )}
                              </div>
                              {model.description && (
                                <p className="mt-2 whitespace-pre-line break-words text-xs leading-5 text-text-1">
                                  {model.description}
                                </p>
                              )}
                            </div>
                            {isSelected && (
                              <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-brand text-white">
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                  <path
                                    d="M10 3L4.5 8.5L2 6"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </section>
            );
          })}
        </div>

        {models.length === 0 && (
          <div className="py-8 text-center text-text-1">
            <p>Keine Modelle verfügbar</p>
            <p className="mt-1 text-sm">Überprüfen Sie Ihre Internetverbindung</p>
          </div>
        )}
      </div>
    </BottomSheet>
  );
}
