import * as React from "react";

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
    <GlassCard variant="default" glow={glow} className={`p-6 ${className || ""}`}>
      <div className="flex items-start gap-4">
        {icon && (
          <div className="flex-shrink-0">
            <div className="h-10 w-10 bg-white/10 flex items-center justify-center rounded-lg text-xl">
              {icon}
            </div>
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="text-white mb-1 text-lg font-semibold">{title}</h3>
          {description && <p className="text-gray-300 mb-4 text-sm">{description}</p>}
          <div className="space-y-4">{children}</div>
        </div>
      </div>
    </GlassCard>
  );
}
