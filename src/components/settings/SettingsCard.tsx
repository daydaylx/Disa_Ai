import * as React from "react";

import { cn } from "../../lib/cn";
import { GlassCard, type GlassGlow } from "../glass/GlassCard";

interface SettingsCardProps {
  title: string;
  description?: string;
  icon?: string;
  glow?: GlassGlow;
  children: React.ReactNode;
  className?: string;
}

export function SettingsCard({
  title,
  description,
  icon,
  glow = "none",
  children,
  className,
}: SettingsCardProps) {
  return (
    <GlassCard variant="default" glow={glow} className={cn("p-6", className)}>
      <div className="flex items-start gap-4">
        {icon && (
          <div className="flex-shrink-0">
            <div className="bg-glass-surface/12 border-glass-border/25 flex h-10 w-10 items-center justify-center rounded-xl border text-xl">
              {icon}
            </div>
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="mb-1 text-lg font-semibold text-text-primary">{title}</h3>
          {description && <p className="mb-4 text-sm text-text-muted/85">{description}</p>}
          <div className="space-y-4">{children}</div>
        </div>
      </div>
    </GlassCard>
  );
}
