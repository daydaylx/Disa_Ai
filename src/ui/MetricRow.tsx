import { cn } from "@/lib/utils";
import { Typography } from "@/ui/Typography";

// MetricRow Component für die horizontalen Bars
interface MetricRowProps {
  label: string;
  value: number; // 0-100
  maxValue?: number;
  color?: "green" | "yellow" | "primary";
  score?: number;
  tooltip?: string; // WCAG: Explanatory tooltip for accessibility
}

export function MetricRow({
  label,
  value,
  maxValue = 100,
  color = "green",
  score,
  tooltip,
}: MetricRowProps) {
  const percentage = Math.min(100, Math.max(0, (value / maxValue) * 100));
  const displayValue = score !== undefined ? score : value;

  // Ink on Paper Color System Integration
  const colorClasses = {
    green: "bg-color-success",
    yellow: "bg-color-warning",
    primary: "bg-accent-primary",
  };

  return (
    <div className="space-y-1" title={tooltip}>
      {/* Label und Score - WCAG: Always show numerical value */}
      <div className="flex items-center justify-between">
        <Typography variant="body-sm" className="text-[var(--text-secondary)]">
          {label}
        </Typography>
        {/* WCAG: Always display numerical value for accessibility */}
        <Typography
          variant="body-xs"
          className="text-[var(--text-muted)] font-[var(--font-medium)]"
          aria-label={`${label}: ${displayValue} out of ${maxValue}`}
        >
          {displayValue}/{maxValue}
        </Typography>
      </div>

      {/* Progress Bar - WCAG: Not relying solely on color */}
      <div
        className="relative h-1.5 bg-surface-inset rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={maxValue}
        aria-label={`${label} progress`}
      >
        <div
          className={cn(
            "absolute inset-y-0 left-0 rounded-full transition-all duration-medium",
            "shadow-sm",
            colorClasses[color],
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
