import type { ModelEntry } from "@/config/models";
import { useSettings } from "@/hooks/useSettings";
import { Check } from "@/lib/icons";
import { cn } from "@/lib/utils";

interface ModelDropdownProps {
  currentModelId: string;
  catalog: ModelEntry[] | null;
  onSelect: (modelId: string) => void;
  onClose?: () => void;
}

export function ModelDropdown({ currentModelId, catalog, onSelect, onClose }: ModelDropdownProps) {
  const { settings } = useSettings();

  const isSafe = (model: ModelEntry) => {
    if (settings.showNSFWContent) return true;
    return model.safety !== "any";
  };

  const models = (catalog || []).filter(isSafe);
  const fallbacks =
    models.length > 0
      ? models
      : [
          {
            id: currentModelId,
            label: currentModelId.split("/").pop() || "Auto",
            safety: "default",
            provider: "default",
            description: "",
            tags: [],
            recommended: false,
            pricing: { in: 0, out: 0 },
          },
        ];

  const handleSelect = (id: string) => {
    onSelect(id);
    onClose?.();
  };

  return (
    <div className="w-[240px] p-1">
      {fallbacks.map((model) => (
        <button
          type="button"
          key={model.id}
          onClick={() => handleSelect(model.id)}
          className={cn(
            "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm text-ink-primary transition-colors",
            "hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/50",
            currentModelId === model.id && "bg-surface-1",
          )}
        >
          <span className="truncate text-left">{model.label}</span>
          {currentModelId === model.id && <Check className="h-4 w-4 text-accent-primary" />}
        </button>
      ))}
    </div>
  );
}
