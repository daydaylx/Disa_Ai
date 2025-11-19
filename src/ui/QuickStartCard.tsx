import { Link } from "react-router-dom";

import { Button } from "./Button";
import { GlassCard } from "./GlassCard";
import { PrimaryButton } from "./PrimaryButton";

interface QuickStartCardProps {
  title?: string;
  description?: string;
  primaryAction: {
    label: string;
    to: string;
  };
  secondaryAction?: {
    label: string;
    to: string;
  };
}

export function QuickStartCard({
  title = "Schnellstart",
  description = "Richte deinen API-Key ein und aktiviere das Gedächtnis. Details kannst du später anpassen.",
  primaryAction,
  secondaryAction,
}: QuickStartCardProps) {
  return (
    <GlassCard variant="primary" className="text-center space-y-4">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-accent/80">{title}</p>
        <p className="text-sm text-text-secondary max-w-lg mx-auto leading-relaxed">
          {description}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <PrimaryButton size="lg" className="w-full sm:w-auto">
          <Link to={primaryAction.to} className="block w-full text-center">
            {primaryAction.label}
          </Link>
        </PrimaryButton>

        {secondaryAction && (
          <Button variant="secondary" size="lg" className="w-full sm:w-auto">
            <Link to={secondaryAction.to} className="block w-full text-center">
              {secondaryAction.label}
            </Link>
          </Button>
        )}
      </div>
    </GlassCard>
  );
}
