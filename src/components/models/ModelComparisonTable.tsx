import { MaterialCard } from "@/ui";

import type { EnhancedModel } from "../../types/enhanced-interfaces";
import { formatPricePerK } from "../../utils/pricing";

interface ModelComparisonTableProps {
  models: EnhancedModel[];
}

export function ModelComparisonTable({ models }: ModelComparisonTableProps) {
  const properties = [
    { label: "Anbieter", getValue: (model: EnhancedModel) => model.provider },
    {
      label: "Preis pro 1K Tokens",
      getValue: (model: EnhancedModel) => formatPricePerK(model.pricing.inputPrice),
    },
    {
      label: "Qualität",
      getValue: (model: EnhancedModel) => `${model.performance.quality}/10`,
    },
    {
      label: "Geschwindigkeit",
      getValue: (model: EnhancedModel) => `${model.performance.speed}/10`,
    },
    {
      label: "Kosten",
      getValue: (model: EnhancedModel) => `${model.performance.efficiency}/10`,
    },
    {
      label: "Verfügbarkeit",
      getValue: (model: EnhancedModel) => `${model.performance.reliability}/10`,
    },
    {
      label: "Tags",
      getValue: (model: EnhancedModel) => (
        <div className="flex flex-wrap gap-1 justify-center">
          {(model.tags || []).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs rounded-full bg-surface-subtle text-text-secondary"
            >
              {tag}
            </span>
          ))}
        </div>
      ),
    },
  ];

  return (
    <MaterialCard>
      <div className="flex flex-col">
        <div className="flex">
          <div className="w-[200px] font-medium p-4">Eigenschaft</div>
          {models.map((model) => (
            <div key={model.id} className="flex-1 text-center font-medium p-4">
              {model.label}
            </div>
          ))}
        </div>
        {properties.map((prop) => (
          <div key={prop.label} className="flex border-t border-border-subtle">
            <div className="w-[200px] font-medium p-4">{prop.label}</div>
            {models.map((model) => (
              <div key={model.id} className="flex-1 text-center p-4">
                {prop.getValue(model)}
              </div>
            ))}
          </div>
        ))}
      </div>
    </MaterialCard>
  );
}
