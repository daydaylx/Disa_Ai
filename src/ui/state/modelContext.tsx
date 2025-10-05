import type { ReactNode } from "react";
import { createContext, useContext, useState } from "react";

import { getModelById } from "../../data/models";

interface ModelContextValue {
  selectedModelId: string;
  setSelectedModelId: (modelId: string) => void;
  selectedModel: ReturnType<typeof getModelById>;
}

const ModelContext = createContext<ModelContextValue | null>(null);

interface ModelProviderProps {
  children: ReactNode;
  defaultModelId?: string;
}

export function ModelProvider({
  children,
  defaultModelId = "anthropic/claude-3.5-sonnet",
}: ModelProviderProps) {
  const [selectedModelId, setSelectedModelId] = useState(defaultModelId);
  const selectedModel = getModelById(selectedModelId);

  return (
    <ModelContext.Provider
      value={{
        selectedModelId,
        setSelectedModelId,
        selectedModel,
      }}
    >
      {children}
    </ModelContext.Provider>
  );
}

export function useModel() {
  const context = useContext(ModelContext);
  if (!context) {
    throw new Error("useModel must be used within a ModelProvider");
  }
  return context;
}
