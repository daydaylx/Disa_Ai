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

  // Aurora Color Palette Integration
  const colorClasses = {
    green: "bg-[var(--aurora-green-500)]",
    yellow: "bg-[var(--aurora-orange-500)]",
    primary: "bg-[var(--aurora-primary-500)]",
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

      {/* Aurora Glass Progress Bar */}
      <div className="relative h-1.5 bg-[var(--glass-surface-subtle)] rounded-full overflow-hidden border border-[var(--glass-border-subtle)]">
        <div
          className={cn(
            "absolute inset-y-0 left-0 rounded-full transition-all duration-[var(--motion-medium)] ease-[var(--ease-aurora)]",
            "shadow-[var(--shadow-glow-soft)]",
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
  // Aurora Palette Integration
  const variantClasses = {
    default:
      "bg-[var(--glass-surface-subtle)] text-[var(--text-primary)] border border-[var(--glass-border-subtle)]",
    success:
      "bg-[var(--aurora-green-500)]/20 text-[var(--aurora-green-600)] border border-[var(--aurora-green-500)]/30",
    warning:
      "bg-[var(--aurora-orange-500)]/20 text-[var(--aurora-orange-600)] border border-[var(--aurora-orange-500)]/30",
    free: "bg-[var(--aurora-green-500)]/10 text-[var(--aurora-green-600)] border border-[var(--aurora-green-500)]/40 shadow-[var(--shadow-glow-green)]",
  };

  // Aurora Touch-Optimized Sizing
  const sizeClasses = {
    sm: "px-[var(--space-xs)] py-[var(--space-xs)] text-[var(--text-xs)] min-h-[24px]",
    md: "px-[var(--space-sm)] py-[var(--space-xs)] text-[var(--text-sm)] min-h-[var(--touch-target-compact)]",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[var(--radius-pill)] font-medium",
        "backdrop-blur-[var(--backdrop-blur-subtle)] transition-all duration-[var(--motion-medium)]",
        "select-none touch-manipulation",
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

const ModelCardComponent = React.memo(
  ({
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
        variant="aurora-glass"
        elevation="medium"
        interactive
        className={cn(
          "rounded-[var(--radius-2xl)] group",
          // Aurora Premium Glass with Green-to-Lila Transition
          "bg-[var(--glass-surface-medium)] backdrop-blur-[var(--backdrop-blur-strong)]",
          "border border-[var(--glass-border-medium)] shadow-[var(--shadow-glow-green)]",
          "hover:shadow-[var(--shadow-glow-lila)] hover:border-[var(--glass-border-aurora)]",
          "hover:-translate-y-1 transition-all duration-[var(--motion-medium)] ease-[var(--ease-aurora)]",
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
                // Aurora Glass Button
                "p-[var(--space-xs)] rounded-[var(--radius-md)]",
                "bg-[var(--glass-surface-subtle)] backdrop-blur-[var(--backdrop-blur-medium)]",
                "border border-[var(--glass-border-subtle)]",
                "transition-all duration-[var(--motion-medium)] ease-[var(--ease-aurora)]",
                "hover:bg-[var(--glass-surface-medium)] hover:scale-105 active:scale-95",
                "min-h-[var(--touch-target-compact)] min-w-[var(--touch-target-compact)]",
                "select-none touch-manipulation",
                isFavorite
                  ? "text-[var(--aurora-orange-500)] hover:text-[var(--aurora-orange-400)] shadow-[var(--shadow-glow-orange)]"
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
  },
);

ModelCardComponent.displayName = "ModelCard";

export const ModelCard = ModelCardComponent;

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
        variant="aurora-soft"
        elevation="subtle"
        interactive
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
  },
);

RoleCardComponent.displayName = "RoleCard";

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
        "inline-flex items-center gap-[var(--space-inline-xs)]",
        "px-[var(--space-sm)] py-[var(--space-xs)] rounded-[var(--radius-pill)]",
        "text-[var(--text-sm)] font-medium backdrop-blur-[var(--backdrop-blur-medium)]",
        "min-h-[var(--touch-target-compact)] select-none touch-manipulation",
        "transition-all duration-[var(--motion-medium)] ease-[var(--ease-aurora)]",
        // Aurora Active/Inactive States
        isActive
          ? [
              "bg-gradient-to-r from-[var(--aurora-primary-500)] to-[var(--aurora-lila-500)]",
              "border border-[var(--aurora-primary-400)] text-white shadow-[var(--shadow-glow-primary)]",
              "hover:from-[var(--aurora-primary-400)] hover:to-[var(--aurora-lila-400)]",
            ].join(" ")
          : [
              "bg-[var(--glass-surface-subtle)] border border-[var(--glass-border-subtle)]",
              "text-[var(--text-secondary)] shadow-[var(--shadow-glow-soft)]",
              "hover:bg-[var(--glass-surface-medium)] hover:border-[var(--glass-border-medium)]",
              "hover:text-[var(--text-primary)] hover:shadow-[var(--shadow-glow-primary)]",
            ].join(" "),
        className,
      )}
    >
      <span>{label}</span>
      {count !== undefined && (
        <span
          className={cn(
            "px-[var(--space-xs)] py-0.5 rounded-[var(--radius-pill)] text-[var(--text-xs)]",
            "transition-all duration-[var(--motion-medium)]",
            isActive
              ? "bg-white/20 text-white backdrop-blur-[var(--backdrop-blur-subtle)]"
              : "bg-[var(--glass-surface-medium)] border border-[var(--glass-border-subtle)] text-[var(--text-muted)]",
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
  // Aurora Palette Integration
  const variantClasses = {
    primary: [
      "bg-gradient-to-r from-[var(--aurora-primary-500)] to-[var(--aurora-lila-500)]",
      "hover:from-[var(--aurora-primary-400)] hover:to-[var(--aurora-lila-400)]",
      "border border-[var(--aurora-primary-400)] text-white shadow-[var(--shadow-glow-primary)]",
      "hover:shadow-[var(--shadow-premium-medium)] hover:scale-[1.02]",
    ].join(" "),
    secondary: [
      "bg-[var(--glass-surface-medium)] backdrop-blur-[var(--backdrop-blur-strong)]",
      "hover:bg-[var(--glass-surface-strong)] text-[var(--text-primary)]",
      "border border-[var(--glass-border-subtle)] shadow-[var(--shadow-glow-soft)]",
      "hover:border-[var(--glass-border-medium)] hover:shadow-[var(--shadow-premium-medium)]",
      "hover:scale-[1.02]",
    ].join(" "),
  };

  return (
    <Card
      variant="aurora-glass"
      className={cn(
        "rounded-[var(--radius-2xl)] p-[var(--space-lg)] cursor-pointer",
        "transition-all duration-[var(--motion-medium)] ease-[var(--ease-aurora)]",
        "min-h-[var(--touch-target-spacious)] select-none touch-manipulation",
        "active:scale-[0.98]",
        variantClasses[variant],
        className,
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-[var(--space-inline-sm)]">
        {icon && (
          <div
            className={cn(
              "flex items-center justify-center",
              "min-w-[var(--touch-target-compact)] min-h-[var(--touch-target-compact)]",
              variant === "primary" ? "text-white" : "text-[var(--text-primary)]",
            )}
          >
            {icon}
          </div>
        )}
        <div className="flex-1">
          <Typography
            variant="body"
            className={cn(
              "font-medium",
              variant === "primary" ? "text-white" : "text-[var(--text-primary)]",
            )}
          >
            {title}
          </Typography>
          {description && (
            <Typography
              variant="body-sm"
              className={cn(
                "mt-1",
                variant === "primary" ? "text-white/80" : "text-[var(--text-secondary)]",
              )}
            >
              {description}
            </Typography>
          )}
        </div>
      </div>
    </Card>
  );
}
