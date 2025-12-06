import { formatPricePerK } from "@/lib/pricing";
import { MaterialCard } from "@/ui";

import type { EnhancedModel } from "../../types/enhanced-interfaces";

interface ModelComparisonTableProps {
  models: EnhancedModel[];
}

export function ModelComparisonTable({ models }: ModelComparisonTableProps) {
  const formatContext = (model: EnhancedModel) => {
    const contextK =
      model.contextK ??
      (model.context.maxTokens ? Math.round(model.context.maxTokens / 1024) : undefined);
    return contextK ? `${contextK}K` : "N/A";
  };

  const formatOpenness = (model: EnhancedModel) => {
    const openness =
      model.openness ??
      (typeof model.censorScore === "number" ? 1 - model.censorScore / 100 : undefined);
    return typeof openness === "number" ? `${Math.round(openness * 100)}%` : "N/A";
  };

  const formatQuality = (model: EnhancedModel) => {
    const quality = model.qualityScore ?? model.performance.quality;
    return `${Math.round(quality)}/100`;
  };

  const properties = [
    { label: "Anbieter", getValue: (model: EnhancedModel) => model.provider },
    {
      label: "Preis pro 1K Tokens",
      getValue: (model: EnhancedModel) => formatPricePerK(model.pricing.inputPrice),
    },
    {
      label: "Qualität",
      getValue: (model: EnhancedModel) => formatQuality(model),
    },
    {
      label: "Kontext",
      getValue: (model: EnhancedModel) => formatContext(model),
    },
    {
      label: "Offenheit",
      getValue: (model: EnhancedModel) => formatOpenness(model),
    },
    {
      label: "Tags",
      getValue: (model: EnhancedModel) => (
        <div className="flex flex-wrap gap-1 justify-center">
          {(model.tags || []).map((tag) => (
            <span
              key={tag}
              className="px-3xs py-3xs text-xs rounded-full bg-surface-subtle text-text-secondary"
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
