import React from "react";

import { SoftDepthSurface } from "./Glass";

interface Model {
  id: string;
  name: string;
  description: string;
  contextLength: number;
  price: string;
  strengths: string[];
  weaknesses: string[];
}

interface ModelsProps {
  models: Model[];
  currentModelId: string;
  onModelSelect: (model: Model) => void;
}

export const Models: React.FC<ModelsProps> = ({ models, currentModelId, onModelSelect }) => {
  return (
    <div className="space-y-3">
      {models.map((model) => (
        <SoftDepthSurface
          key={model.id}
          variant="subtle"
          className={`cursor-pointer rounded-lg p-2 transition-colors hover:bg-[rgba(255,255,255,0.05)] ${
            currentModelId === model.id ? "border-[var(--acc1)] shadow-[var(--neon)]" : ""
          }`}
          onClick={() => onModelSelect(model)}
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-medium text-[var(--fg)]">{model.name}</h3>
              <p className="mt-1 text-sm text-[var(--fg-dim)]">{model.description}</p>
            </div>
            {currentModelId === model.id && (
              <span className="rounded-full bg-[var(--acc1)] px-2 py-1 text-xs text-[var(--bg0)]">
                Aktiv
              </span>
            )}
          </div>
          <div className="mt-2 flex gap-4 text-xs text-[var(--fg-dim)]">
            <span>Kontext: {model.contextLength}</span>
            <span>Preis: {model.price}</span>
          </div>
        </SoftDepthSurface>
      ))}
    </div>
  );
};
