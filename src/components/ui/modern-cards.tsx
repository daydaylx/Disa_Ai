import React, { type ReactNode } from "react";

import { cn } from "../../lib/utils";
import type { EnhancedRole } from "../../types/enhanced-interfaces";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Typography } from "../ui/typography";

// MetricRow Component für die horizontalen Bars
interface MetricRowProps {
  label: string;
  value: number; // 0-100
  maxValue?: number;
  color?: "green" | "yellow" | "primary";
  score?: number;
  showScore?: boolean;
}

export function MetricRow({
  label,
  value,
  maxValue = 100,
  color = "green",
  score,
  showScore = true,
}: MetricRowProps) {
  const percentage = Math.min(100, Math.max(0, (value / maxValue) * 100));

  const colorClasses = {
    green: "bg-[var(--accent-green)]",
    yellow: "bg-[var(--accent-yellow)]",
    primary: "bg-[var(--color-primary-500)]",
  };

  return (
    <div className="space-y-1">
      {/* Label und Score */}
      <div className="flex items-center justify-between">
        <Typography variant="body-sm" className="text-[var(--text-secondary)]">
          {label}
        </Typography>
        {showScore && score !== undefined && (
          <Typography variant="body-xs" className="text-[var(--text-muted)]">
            {score}
          </Typography>
        )}
      </div>

      {/* Progress Bar */}
      <div className="relative h-1.5 bg-[var(--color-neutral-700)] rounded-full overflow-hidden">
        <div
          className={cn(
            "absolute inset-y-0 left-0 rounded-full transition-all duration-300",
            colorClasses[color],
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// Chip/Pill Component
interface ChipProps {
  children: ReactNode;
  variant?: "default" | "success" | "warning" | "free";
  size?: "sm" | "md";
  className?: string;
}

export function Chip({ children, variant = "default", size = "sm", className }: ChipProps) {
  const variantClasses = {
    default: "bg-[var(--color-neutral-700)] text-[var(--text-primary)]",
    success: "bg-[var(--accent-green)]/20 text-[var(--accent-green)]",
    warning: "bg-[var(--accent-yellow)]/20 text-[var(--accent-yellow)]",
    free: "bg-[var(--accent-green)]/10 text-[var(--accent-green)] border border-[var(--accent-green)]/30",
  };

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
    >
      {children}
    </span>
  );
}

// ModelCard Component
interface ModelCardProps {
  name: string;
  vendor: string;
  speed: number;
  quality: number;
  value: number;
  isFree: boolean;
  price: string;
  contextLength: string;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  className?: string;
}

const ModelCardComponent = React.memo(({
  name,
  vendor,
  speed,
  quality,
  value,
  isFree,
  price,
  contextLength,
  isFavorite = false,
  onToggleFavorite,
  className,
}: ModelCardProps) => {
  return (
    <Card
      tone="modern-elevated"
      interactive="gentle"
      className={cn(
        "rounded-2xl glass-panel--glow-green shadow-glow-green hover:shadow-glow-lila group",
        "hover:-translate-y-1 transition-all duration-300 ease-[var(--motion-ease-elastic)]",
        className,
      )}
    >
      {/* Oben: Name + Provider + Favorite-Icon */}
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <Typography variant="body" className="text-[var(--text-primary)] font-medium truncate">
            {name}
          </Typography>
          <Typography variant="body-xs" className="text-[var(--text-secondary)] mt-0.5">
            {vendor}
          </Typography>
        </div>

        {onToggleFavorite && (
          <button
            onClick={onToggleFavorite}
            className={cn(
              "p-2 rounded-full transition-colors duration-200",
              isFavorite
                ? "text-[var(--accent-yellow)] hover:text-[var(--accent-yellow)]/80"
                : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]",
            )}
            aria-label={isFavorite ? "Von Favoriten entfernen" : "Zu Favoriten hinzufügen"}
          >
            ★
          </button>
        )}
      </div>

      {/* Mitte: 3x MetricRow */}
      <div className="space-y-2">
        <MetricRow label="Speed" value={speed} score={speed} color="green" />
        <MetricRow label="Quality" value={quality} score={quality} color="green" />
        <MetricRow label="Value" value={value} score={value} color="yellow" />
      </div>

      {/* Unten: Chips */}
      <div className="flex flex-wrap gap-2">
        {isFree ? (
          <Chip variant="free" size="sm">
            FREE
          </Chip>
        ) : (
          <Chip variant="default" size="sm">
            {price}
          </Chip>
        )}
        <Chip variant="default" size="sm">
          {contextLength}
        </Chip>
        <Chip variant="default" size="sm">
          Context
        </Chip>
      </div>
    </Card>
  );
});

ModelCardComponent.displayName = 'ModelCard';

export const ModelCard = ModelCardComponent;

// RoleCard Component
interface RoleCardProps {
  role: EnhancedRole;
  isActive?: boolean;
  onActivate?: () => void;
  onDeactivate?: () => void;
  className?: string;
}

const RoleCardComponent = React.memo(({
  role,
  isActive = false,
  onActivate,
  onDeactivate,
  className,
}: RoleCardProps) => {
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
      variant="surface"
      interactive="glass-lift"
      className={cn(
        "rounded-2xl glass-panel shadow-glow-subtle group hover:shadow-glow-primary",
        "hover:-translate-y-[2px] hover:border-primary/50 transition-all duration-300 [box-shadow:inset_0_2px_4px_rgba(0,0,0,0.1)]",
        isActive && "ring-2 ring-primary/50 ring-offset-2 shadow-glow-lila !translate-y-[-1px]",
        className,
      )}
    >
      {/* Zeile 1: Titel + Aktivieren-Button */}
      <div className="flex items-center justify-between">
        <Typography variant="body" className="text-[var(--text-primary)] font-medium flex-1 pr-3">
          {title}
        </Typography>

        <Button
          variant={isActive ? "outline" : "default"}
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
});

RoleCardComponent.displayName = 'RoleCard';

export const RoleCard = RoleCardComponent;

// Filter Chips für Rollen-Screen
interface FilterChipProps {
  label: string;
  count?: number;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

export function FilterChip({
  label,
  count,
  isActive = false,
  onClick,
  className,
}: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-200",
        isActive
          ? "bg-[var(--color-primary-500)] text-white"
          : "bg-[var(--surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--color-neutral-700)]",
        className,
      )}
    >
      <span>{label}</span>
      {count !== undefined && (
        <span
          className={cn(
            "px-1.5 py-0.5 rounded-full text-xs",
            isActive
              ? "bg-white/20 text-white"
              : "bg-[var(--color-neutral-600)] text-[var(--text-muted)]",
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
}

// Action Card für Chat-Start
interface ActionCardProps {
  title: string;
  description?: string;
  onClick?: () => void;
  icon?: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
}

export function ActionCard({
  title,
  description,
  onClick,
  icon,
  variant = "primary",
  className,
}: ActionCardProps) {
  const variantClasses = {
    primary: "bg-[var(--color-primary-500)] hover:bg-[var(--color-primary-600)] text-white",
    secondary:
      "bg-[var(--surface)] hover:bg-[var(--surface-soft)] text-[var(--text-primary)] border border-[var(--glass-border-soft)]",
  };

  return (
    <Card
      variant="surface"
      className={cn(
        "rounded-2xl p-4 cursor-pointer transition-all duration-200 hover:shadow-[var(--shadow-heavy)]",
        variantClasses[variant],
        className,
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        {icon && <div className="text-[var(--text-primary)]">{icon}</div>}
        <div className="flex-1">
          <Typography variant="body" className="font-medium">
            {title}
          </Typography>
          {description && (
            <Typography variant="body-sm" className="text-[var(--text-secondary)] mt-1">
              {description}
            </Typography>
          )}
        </div>
      </div>
    </Card>
  );
}
