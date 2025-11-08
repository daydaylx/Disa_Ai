import { Bot } from "../../lib/icons";
import { useEffect, useState } from "react";

interface Model {
  id: string;
  name: string;
}

interface ModelSelectProps {
  model: string;
  setModel: (model: string) => void;
}

export function ModelSelect({ model, setModel }: ModelSelectProps) {
  const [models, setModels] = useState<Model[]>([]);

  useEffect(() => {
    void fetch("/models.json")
      .then((res) => res.json())
      .then(setModels);
  }, []);

  return (
    <div>
      <h2 className="text-sm font-semibold text-[var(--color-text-secondary)]">Model</h2>
      <div className="mt-2 flex items-center gap-2">
        <Bot className="h-5 w-5 text-[var(--color-text-secondary)]" />
        <select
          className="w-full bg-transparent/50 backdrop-blur-sm text-sm border border-transparent hover:border-gray-300 focus:border-blue-500 focus:ring-0 rounded-md transition-colors duration-200 glass-panel p-2"
          value={model}
          onChange={(e) => setModel(e.target.value)}
        >
          {models.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
