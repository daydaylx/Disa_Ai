import React from "react";

import { cn } from "@/lib/utils";
import type { EnhancedRole } from "@/types/enhanced-interfaces";
import { Button } from "@/ui/Button";
import { Card } from "@/ui/Card";
import { Chip } from "@/ui/Chip";
import { Typography } from "@/ui/Typography";

// RoleCard Component
interface RoleCardProps {
  role: EnhancedRole;
  isActive?: boolean;
  onActivate?: () => void;
  onDeactivate?: () => void;
  className?: string;
}

const RoleCardComponent = React.memo(
  ({ role, isActive = false, onActivate, onDeactivate, className }: RoleCardProps) => {
    // Destructure properties from role object
    const { name: title, description, tags = [], usage, allowedModels = [], metadata } = role;

    const usageCount = usage.count;
    const modelsCount = allowedModels.length;
    const isDefault = metadata.isBuiltIn;
    const formatUsage = (count: number) => {
      if (count === 0) return "Nie genutzt";
      if (count === 1) return "1x genutzt";
      return `${count}x genutzt`;
    };

    const formatModels = (count: number) => {
      if (count === 1) return "1 Modell";
      return `${count} Modelle`;
    };

    const meta = [formatUsage(usageCount), formatModels(modelsCount), isDefault ? "Standard" : null]
      .filter(Boolean)
      .join(" · ");

    return (
      <Card
        className={cn(
          "rounded-[var(--radius-2xl)] group",
          // Aurora Glass Panel with Premium Effects
          "bg-[var(--glass-surface-subtle)] backdrop-blur-[var(--backdrop-blur-medium)]",
          "border border-[var(--glass-border-subtle)] shadow-[var(--shadow-glow-soft)]",
          "hover:bg-[var(--glass-surface-medium)] hover:shadow-[var(--shadow-glow-primary)]",
          "hover:-translate-y-[2px] hover:border-[var(--aurora-primary-500)]/50",
          "transition-all duration-[var(--motion-medium)] ease-[var(--ease-aurora)]",
          // Active State with Aurora Ring
          isActive && [
            "ring-2 ring-[var(--aurora-primary-500)]/50 ring-offset-2 ring-offset-[var(--surface-base)]",
            "shadow-[var(--shadow-glow-lila)] !translate-y-[-1px]",
            "border-[var(--aurora-primary-500)]",
          ],
          className,
        )}
      >
        {/* Zeile 1: Titel + Aktivieren-Button */}
        <div className="flex items-center justify-between">
          <Typography variant="body" className="text-[var(--text-primary)] font-medium flex-1 pr-3">
            {title}
          </Typography>

          <Button
            variant={isActive ? "ghost" : "secondary"}
            size="sm"
            onClick={isActive ? onDeactivate : onActivate}
            className="flex-shrink-0 tap-target min-h-[44px] min-w-[44px] px-4 py-3"
          >
            {isActive ? "Deaktivieren" : "Aktivieren"}
          </Button>
        </div>

        {/* Zeile 2: Tags als Pills */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag, index) => (
              <Chip key={index} variant="default" size="sm">
                #{tag}
              </Chip>
            ))}
          </div>
        )}

        {/* Zeile 3: Meta */}
        <Typography variant="body-xs" className="text-[var(--text-muted)]">
          {meta}
        </Typography>

        {/* Beschreibung */}
        {description && (
          <Typography variant="body-sm" className="text-[var(--text-secondary)] line-clamp-2">
            {description}
          </Typography>
        )}
      </Card>
    );
  },
);

RoleCardComponent.displayName = "RoleCard";

export const RoleCard = RoleCardComponent;
