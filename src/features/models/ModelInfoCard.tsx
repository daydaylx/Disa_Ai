import React from "react";
import type { Model } from "./state";
import { cn } from "../../lib/utils/cn";

export interface ModelInfoCardProps {
  model: Model;
  className?: string;
}

function fmtUSD(x?: number): string {
  if (!x || !isFinite(x)) return "k. A.";
  // USD pro 1M Tokens:
  const v = x;
  if (v >= 1000) return `$${(v/1000).toFixed(1)}k / 1M`;
  return `$${v.toFixed(2)} / 1M`;
}

export const ModelInfoCard: React.FC<ModelInfoCardProps> = ({ model, className }) => {
  return (
    <div className={cn("p-3", className)}>
      <div className="text-sm">
        {model.description ? (
          <p className="leading-relaxed">{model.description}</p>
        ) : (
          <p className="text-muted-foreground">Keine Beschreibung verfügbar.</p>
        )}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
        <div><span className="font-medium">Kontext:</span> {model.context ? `${model.context.toLocaleString()} Tokens` : "k. A."}</div>
        <div><span className="font-medium">Provider:</span> {model.provider ?? "k. A."}</div>
        <div><span className="font-medium">Prompt-Kosten:</span> {fmtUSD(model.pricing?.prompt)}</div>
        <div><span className="font-medium">Completion-Kosten:</span> {fmtUSD(model.pricing?.completion)}</div>
      </div>
      {model.tags?.length ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {model.tags.map((t) => (
            <span key={t} className="model-badge">{t}</span>
          ))}
        </div>
      ) : null}
    </div>
  );
};
