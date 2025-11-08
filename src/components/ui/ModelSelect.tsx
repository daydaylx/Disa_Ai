import { useDeferredLoad } from "../../hooks/useDeferredFetch";
import { Bot } from "../../lib/icons";

interface Model {
  id: string;
  name: string;
}

interface ModelSelectProps {
  model: string;
  setModel: (model: string) => void;
}

export function ModelSelect({ model, setModel }: ModelSelectProps) {
  // Deferred loading of models - only loads when user interacts
  const {
    data: models,
    loading: modelsLoading,
    error: modelsError,
  } = useDeferredLoad(async () => {
    const response = await fetch("/models.json");
    if (!response.ok) {
      throw new Error(`Failed to load models: ${response.status}`);
    }
    return (await response.json()) as Model[];
  });

  return (
    <div>
      <h2 className="text-sm font-semibold text-[var(--color-text-secondary)]">Model</h2>
      <div className="mt-2 flex items-center gap-2">
        <Bot className="h-5 w-5 text-[var(--color-text-secondary)]" />
        <select
          className="w-full bg-transparent/50 backdrop-blur-sm text-sm border border-transparent hover:border-gray-300 focus:border-blue-500 focus:ring-0 rounded-md transition-colors duration-200 glass-panel p-2"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          disabled={modelsLoading}
        >
          {modelsLoading ? (
            <option value="">Lade Modelle...</option>
          ) : modelsError ? (
            <option value="">Fehler beim Laden</option>
          ) : !models || models.length === 0 ? (
            <option value="">Keine Modelle verfügbar</option>
          ) : (
            models.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))
          )}
        </select>
      </div>
    </div>
  );
}
