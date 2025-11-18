import React from "react";

import { cn } from "@/lib/utils";
import type { EnhancedRole } from "@/types/enhanced-interfaces";
import { Button } from "@/ui/Button";
import { Chip } from "@/ui/Chip";
import { MobileCard } from "@/ui/MobileCard";
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
      <MobileCard
        accent={isActive ? "lila" : "primary"}
        className={cn("transition-colors", className)}
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <Typography variant="body" className="text-[var(--text-primary)] font-semibold">
                {title}
              </Typography>
              {description && (
                <Typography variant="body-sm" className="text-[var(--text-secondary)] line-clamp-2">
                  {description}
                </Typography>
              )}
            </div>

            <Button
              variant={isActive ? "secondary" : "primary"}
              size="sm"
              onClick={isActive ? onDeactivate : onActivate}
              className="flex-shrink-0 min-w-[110px]"
            >
              {isActive ? "Aktiv" : "Aktivieren"}
            </Button>
          </div>

          <Typography variant="body-xs" className="text-[var(--text-muted)]">
            {meta}
          </Typography>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag, index) => (
                <Chip key={index} variant="default" size="sm">
                  #{tag}
                </Chip>
              ))}
            </div>
          )}
        </div>
      </MobileCard>
    );
  },
);

RoleCardComponent.displayName = "RoleCard";

export const RoleCard = RoleCardComponent;
