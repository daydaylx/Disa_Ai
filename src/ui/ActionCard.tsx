import { type ReactNode } from "react";

import { cn } from "@/lib/utils";
import { Card } from "@/ui/Card";
import { Typography } from "@/ui/Typography";

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
  // Ink on Paper Design System Integration
  const variantClasses = {
    primary: [
      "bg-accent-primary text-ink-on-accent shadow-brandGlow",
      "hover:bg-accent-hover hover:shadow-brandGlowLg hover:scale-[1.02]",
      "border border-accent-primary/30",
    ].join(" "),
    secondary: [
      "bg-surface-2 shadow-raise text-text-primary",
      "hover:shadow-raiseLg",
      "hover:scale-[1.02]",
    ].join(" "),
  };

  return (
    <Card
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
